import "reflect-metadata";
import { SAMPLE } from "@repo/common/sample";
import express from "express";
import { google, sheets_v4 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { appDataSource } from "./config/dbconfig.js";
import { authorize } from "./auth.js"
import {
	Lemma,
	WordForm,
	Example,
	Media,
	Definition,
	Comment,
	PartOfSpeech,
	Lect,
} from "./db/dbmodel.js";

const RELOAD_SHEET_ON_START = false;



appDataSource
	.initialize()
	.then(async () => {
		initExpress();

		if (RELOAD_SHEET_ON_START) {
			const lect_repository = appDataSource.getRepository(Lect);
			const word_form_repository = appDataSource.getRepository(WordForm);
			const lemma_repository = appDataSource.getRepository(Lemma);

			await word_form_repository.clear();
			await lemma_repository.clear();
			await lect_repository.clear();

			authorize().then(loadSheet).catch(console.error);
		}
	})
	.catch((error) => console.log(error));


function initExpress() {
	const app = express();
	const PORT = 1225;

	const lect_repository = appDataSource.getRepository(Lect);
	const word_form_repository = appDataSource.getRepository(WordForm);
	const lemma_repository = appDataSource.getRepository(Lemma);

	app.get("/", (req, res) => {
		res.render("search", { title: "Suha", message: "Bratsa" });
	});

	app.get("/sample", (_req, res) => {
		res.status(200).send(SAMPLE);
	});

	app.get("/search", async (req, res) => {

		const search_term = req.query.search_term?.toString();

		if(!search_term) {
			return;
		}

		const lemmas: Lemma[] = (
			await Lemma.find({
				relations: {
					word_forms: { lect: true },
				},
			})
		).filter((e) => {
			for (const wf of e.word_forms) {
				if (wf.word_form.includes(search_term)) {
					return true;
				}
			}
		});

		const lects = await Lect.find();
		return res.render("search_results", {
			terms: lemmas.length,
			results: lemmas,
			lects: lects,
		});
	});

	app.set("views", "./res/views");
	app.set("view engine", "pug");

	app.listen(PORT, () => {
		console.log(`Backend started @ http://localhost:${PORT} !`);
		console.log(SAMPLE);
	});
}

/**
 * @param {google.auth.OAuth2Client} auth The authenticated Google OAuth client.
 */
async function loadSheet(auth: OAuth2Client) {
  const options: any = { version: "v4", auth };
  const sheets = google.sheets(options);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1-YkCeynx_-KYdubvt14augSPo37_20YgUv_f-i8HVwY",
    range: "al_ko_mit_govor",
  });

  const rows = res.data.values;
  
  const keys_res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1-YkCeynx_-KYdubvt14augSPo37_20YgUv_f-i8HVwY",
    range: "klucz",
  });

  const keys = keys_res.data.values;
  
  if (!rows || rows.length === 0) {
    console.error("No data found.");
    return;
  }

  if (!keys || keys.length === 0) {
    console.error("No lemma keys found.");
    return;
  }

  const lects = rows.shift();

  if (keys.length != rows.length) {
    console.error("Lemma count doesn't match number of rows.");
    return;
  }

  if (!lects){
	console.error("No lects found");
	return;
  }

  for (const lect of lects) {
    let l = new Lect();
    l.name = lect;
    l.save();
    console.log(l);
  }

  const nikolect = lects.indexOf("Nikomiko");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const lemma_key = keys[i]?.[0];
    const lemma = new Lemma();

    if (lemma_key == null || lemma_key.length == 0) {
      //assign a random UUID to the lemma as punishment for our failures
      lemma.lemma_name = crypto.randomUUID();
      console.log(`womp womp, missing lemma name, calling it ${lemma.lemma_name}`)
    } else {
      lemma.lemma_name = lemma_key;
    }

    console.log(lemma);
    await lemma.save();

    for(let i=0; i<rows.length; i++){
      const cell = row?.[i];
      if (cell === null || cell === undefined || (typeof cell === "string" && cell.length === 0)) {
        continue;
      }

      for (let word_form of cell.split(";")) {
        const f = new WordForm();
        f.word_form = word_form;
        f.lemma = lemma;
        f.lect = lects[i];
        //console.log(f);
        await f.save();
      }

    }

  }
}