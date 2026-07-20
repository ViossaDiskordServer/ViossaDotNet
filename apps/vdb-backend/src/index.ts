import "reflect-metadata";
import { SAMPLE } from "@repo/common/sample";
import express from "express";
import crypto from "crypto";
import fs from "fs";
import { appDataSource } from "./config/dbconfig.js";
import { Lemma, WordForm, Lect, Definition, Example } from "./db/dbmodel.js";
import "@total-typescript/ts-reset";
import { Like, In } from "typeorm";
import cors from "cors";

const RELOAD_SHEET_ON_START = false;
const SOURCE_FILE = "res/sample.tsv";

appDataSource
	.initialize()
	.then(async () => {
		initExpress();

		if (RELOAD_SHEET_ON_START) {
			await loadSheet();
		}
	})
	.catch((error) => console.log(error));

function initExpress() {
	const app = express();
	const PORT = 1225;

	const lect_repository = appDataSource.getRepository(Lect);
	const word_form_repository = appDataSource.getRepository(WordForm);
	const lemma_repository = appDataSource.getRepository(Lemma);

	app.use(cors(), express.json());

	app.get("/sample", (_req, res) => {
		res.status(200).send(SAMPLE);
	});

	app.get("/search", async (req, res) => {
		const search_term = req.query.search_term?.toString();

		let word_forms: WordForm[];
		let lemmas: Lemma[];

		if (!search_term) {
			lemmas = await Lemma.find({
				relations: { word_forms: { lect: true } }
			});
		} else {
			word_forms = await WordForm.find({
				where: { word_form: Like(`%${search_term}%`) },
				relations: { lemma: true },
			});

			let lemma_ids = word_forms.map((w) => w.lemma.lemma_name);

			lemmas = await Lemma.find({
				where: { lemma_name: In(lemma_ids) },
				relations: { word_forms: { lect: true } },
			});
		}

		res.status(200).send({ terms: lemmas.length, results: lemmas });
	});

	app.get("/lect", async (req, res) => {
		const name = req.query.name?.toString();

		if (!name) {
			return void res.sendStatus(400);
		}

		const lect = await Lect.findOne({
			where: { name: name },
			relations: { word_forms: { lemma: true } },
		});

		res.status(200).send({ lect });
	});

	app.post("/lect", (req, res) => {
		const lect_name = req.query.lect_name?.toString();

		if (!lect_name) {
			return void res.sendStatus(400);
		}

		const lect = new Lect();
		lect.name = lect_name;
		lect.save().then((lect)=>{
			res.status(200).send({ lect })
		});

	});

	app.get("/lects", async (_req, res) => {
		const lects = await Lect.find();
		res.status(200).send({ lects });
	});

	app.get("/lemma-detail", async (_req, res) => {
		const lemma_name = _req.query.lemma_name?.toString();

		const lemma_detail = await Lemma.findOne({
			where: {
				lemma_name: lemma_name
			},
			relations: {
				word_forms: {
					lect: true
				},
				examples: true,
				definitions: true,
				media: true,
				parts_of_speech: true
			}
		});

		res.status(200).send({ lemma_detail });
	});

	/* Definitions */

	app.put("/definition", async (_req, res) => {
		const definition_text = _req.body.definition_text?.toString();
		const definition_id = _req.body.definition_id ?? null;
		const lemma_name = _req.body.lemma_name?.toString();

		if(definition_text == null || lemma_name == null){
			console.error(`Error: ${JSON.stringify({definition_text:definition_text, lemma_name:lemma_name})}`);
			return void res.status(400).send();
		}

		const lemma = await Lemma.findOne({where:{
			lemma_name: lemma_name
		}});

		if(!lemma){
			return void res.status(400).send();
		}

		let definition:Definition = new Definition();
		definition.definition_text = definition_text;
		definition.lemma = lemma;
		if(definition_id){
			definition.definition_id = definition_id;
		}

		Definition.save(definition)
		
		let lemma_detail = await Lemma.findOne({
			where: {
				lemma_name: lemma_name
			},
			relations: {
				word_forms: {
					lect: true
				},
				examples: true,
				definitions: true,
				media: true,
				parts_of_speech: true
			}
		});

		res.status(200).send({lemma_detail});
	});

	/* examples */

	app.put("/example", async (_req, res) => {
		const example_text = _req.body.example_text?.toString();
		const example_id = _req.body.example_id ?? null;
		const lemma_name = _req.body.lemma_name?.toString();

		if(!example_text || !lemma_name){
			return void res.status(400).send();
		}

		const lemma = await Lemma.findOne({where:{
			lemma_name
		}});

		if(!lemma){
			return void res.status(400).send();
		}

		var example:Example = new Example();
		example.example_text = example_text;
		example.lemma = lemma;
		if(example_id){
			example.example_id = example_id;
		}
		

		Example.save(example)
		
		var lemma_detail = await Lemma.findOne({
			where: {
				lemma_name: lemma_name
			},
			relations: {
				word_forms: {
					lect: true
				},
				examples: true,
				definitions: true,
				media: true,
				parts_of_speech: true
			}
		});

		res.status(200).send({lemma_detail});
	});

	/* word forms */

	app.put("/word-form", async (_req, res) => {
		const word_form_text = _req.body.word_form_text?.toString();
		const word_form_id = _req.body.word_form_id ?? null;
		const lemma_name = _req.body.lemma_name ?? null;

		if(!word_form_text || /^\s*$/.test(word_form_text) || !word_form_id){
			console.error(`Error: ${JSON.stringify({word_form_text:word_form_text, word_form_id:word_form_id})}`);
			return void res.status(400).send();
		}

		let word_form = await WordForm.findOne({where:{
			word_form_id: word_form_id
		}, relations:{
			lemma: true
		}});

		if(!word_form){
			if(lemma_name){
				word_form = new WordForm();
				let lemma = await Lemma.findOne({where:{lemma_name}});
			}
			console.error(`Failed to find word form with ID ${word_form_id}`)
			return void res.status(400).send();
		} 


		word_form.word_form = word_form_text;

		WordForm.save(word_form);
		
		let lemma_detail = await Lemma.findOne({
			where: {
				lemma_name: word_form.lemma.lemma_name
			},
			relations: {
				word_forms: {
					lect: true
				},
				examples: true,
				definitions: true,
				media: true,
				parts_of_speech: true
			}
		});

		res.status(200).send({lemma_detail});
	});

	app.post("/word-form", async (_req, res) => {
		const lemma_name = _req.body.lemma_name ?? null;
		const lect_name = _req.body.lect_name ?? null;
		const word_form_text = _req.body.word_form_text?.toString();

		if(!word_form_text || /^\s*$/.test(word_form_text) || !lect_name || !lemma_name){
			console.error(`Error: ${JSON.stringify(_req.body)}`);
			return void res.status(400).send();
		}

		let word_form = new WordForm();
		let lemma = await Lemma.findOne({where:{lemma_name}});
		let lect;
		try{
			lect = await Lect.findOne({where:{name:lect_name}});
		} catch {
			console.info(`Lect ${lect_name} not found.`);
		}
		 
		if(!lemma){
			console.error(`Error: ${JSON.stringify({lect:lect, lemma:lemma})}`);
			return void res.status(400).send();
		}

		if(!lect) {
			lect = new Lect();
			lect.name = lect_name;
			await lect
				.save()
				.then((l)=>{console.info(`Created lect: ${JSON.stringify(l)}`)});
		}


		word_form.word_form = word_form_text;
		word_form.lemma = lemma;
		word_form.lect = lect;

		WordForm.save(word_form);
		
		let lemma_detail = await Lemma.findOne({
			where: {
				lemma_name: word_form.lemma.lemma_name
			},
			relations: {
				word_forms: {
					lect: true
				},
				examples: true,
				definitions: true,
				media: true,
				parts_of_speech: true
			}
		});

		res.status(200).send({lemma_detail});
	});
	
	app.delete("/word-form/:word_form_id", async (_req, res) =>{
		const word_form_id:number = parseInt(_req.params.word_form_id); 

		if(!word_form_id){
			console.error(`Error: Could not find word form ${JSON.stringify({word_form_id:word_form_id})}`);
			return void res.status(400).send();
		}

		WordForm.delete({word_form_id: word_form_id});

		res.status(200).send();
	});

	app.listen(PORT, () => {
		console.log(`Backend started @ http://localhost:${PORT} !`);
		console.log(SAMPLE);
	});
}

async function loadSheet() {
	const lect_repository = appDataSource.getRepository(Lect);
	const word_form_repository = appDataSource.getRepository(WordForm);
	const lemma_repository = appDataSource.getRepository(Lemma);

	await word_form_repository.clear();
	await lemma_repository.clear();
	await lect_repository.clear();

	const rawData: string = fs.readFileSync(SOURCE_FILE, "utf8");
	const rows: string[] = rawData.split("\n");

	if (!rows || rows.length === 0) {
		console.error("No data found.");
		return;
	}

	const lect_names = rows.shift()?.split("\t");

	const keys = rows.map((row) => row.split("\t")[0]?.split(";")[0]);
	console.log(keys);

	if (keys.length != rows.length) {
		console.error("Lemma count doesn't match number of rows.");
		return;
	}

	if (!lect_names) {
		console.error("No lects found");
		return;
	}

	const lects = Array<Lect>();

	for (const lect of lect_names) {
		let l = new Lect();
		l.name = lect;
		l.save();
		lects.push(l);
		console.log(l);
	}

	const lemmas = Array<Lemma>();

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]?.split("\t");
		const lect_name = lect_names[i];

		if (!lect_name) {
			console.error("No lect name");
			break;
		}

		if (!row) {
			console.error("Row doesn't exist");
			continue;
		}

		if (row.length !== lect_names.length) {
			console.error("Mismatched row size");
			continue;
		}

		const lemma_key = row[0];

		const lemma = new Lemma();

		if (lemma_key == null || lemma_key.length == 0) {
			//assign a random UUID to the lemma as punishment for our failures
			lemma.lemma_name = crypto.randomUUID();
			console.log(
				`womp womp, missing lemma name, calling it ${lemma.lemma_name}`,
			);
		} else {
			lemma.lemma_name = lemma_key;
		}

		lemmas.push(lemma);
		lemma.word_forms = Array<WordForm>();

		for (let j = 0; j < row.length; j++) {
			const cell = row?.[j];
			const lect = lects[j];

			if (
				cell === null
				|| cell === undefined
				|| (typeof cell === "string" && cell.length === 0)
				|| !lect
			) {
				continue;
			}

			for (let word_form of cell.split(";")) {
				const f = new WordForm();
				f.word_form = word_form;
				f.lect = lect;
				lemma.word_forms.push(f);
			}
		}
	}

	for (let i = 0; i < lemmas.length; i += 100) {
		await lemma_repository.save(lemmas.slice(i, i + 100));
		console.log(
			`Saved ${Math.min(i + 100, lemmas.length)} / ${
				lemmas.length
			} lemmas...`,
		);
	}

	console.log(`Loaded ${lemmas.length} lemmas!`);
}
