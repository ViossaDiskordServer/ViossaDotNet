import "reflect-metadata";
import { SAMPLE } from "@repo/common/sample";
import express from "express";
import crypto from "crypto"
import fs from 'fs';
;import { appDataSource } from "./config/dbconfig.js";
import { Lemma, WordForm, Lect } from "./db/dbmodel.js";
import "@total-typescript/ts-reset";
import {
	Like, In
} from "typeorm";

const RELOAD_SHEET_ON_START = false;
const SOURCE_FILE = 'res/sample.tsv'

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

	app.get("/sample", (_req, res) => {
		res.status(200).send(SAMPLE);
	});

	app.get("/search", async (req, res) => {
		const search_term = req.query.search_term?.toString();

		if (!search_term) {
			return void res.sendStatus(400);
		}

		const word_forms: WordForm[] = await WordForm.find({
			where:{word_form: Like(`%${search_term}%`)},
			relations: { lemma: true }
		});

		let lemma_ids = word_forms.map(w=>w.lemma.lemma_name);

		const lemmas: Lemma[] = await Lemma.find({
			where: { lemma_name: In(lemma_ids)},
			relations: {  word_forms: { lect: true }}
		})

		res.status(200).send({
			terms: lemmas.length,
			results: lemmas
		});
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

	app.get("/lects", async (_req, res) => {
		const lects = await Lect.find();
		res.status(200).send({
			lects,
		});
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

		
	const rawData: string = fs.readFileSync(SOURCE_FILE, 'utf8');
	const rows: string[] = rawData.split('\n');

	if (!rows || rows.length === 0) {
		console.error("No data found.");
		return;
	}

	const lect_names = rows.shift()?.split('\t');

	const keys = rows.map(row=>row.split('\t')[0]?.split(';')[0]);
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
		lects.push(l)
		console.log(l);
	}

	const lemmas = Array<Lemma>();

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]?.split('\t');
		const lect_name = lect_names[i];

		if(!lect_name){
			console.error("No lect name");
			break;
		}

		if(!row){
			console.error("Row doesn't exist");
			continue;
		}
		
		if(row.length !== lect_names.length){
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
				cell === null ||
				cell === undefined ||
				(typeof cell === "string" && cell.length === 0) ||
				!lect
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
