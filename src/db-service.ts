import * as crypto from 'crypto';

import { promises as fs } from 'fs';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

import { appDataSource } from './vdb/dbconfig';
import { Lemma, WordForm, Lect } from './vdb/dbmodel';

const RELOAD_SHEET_ON_START = false;

appDataSource
	.initialize()
	.then(async () => {
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

//setup google auth
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'res/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'res/credentials.json');
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_PATH);
		const credentials = JSON.parse(content.toString());
		return google.auth.fromJSON(credentials);
	} catch (err) {
		return null;
	}
}


/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: any) {
	const content = await fs.readFile(CREDENTIALS_PATH);
	const keys = JSON.parse(content.toString());
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client: any = await loadSavedCredentialsIfExist();
	if (client) {
		return client;
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});
	if (client.credentials) {
		await saveCredentials(client);
	}
	return client;
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function loadSheet(auth: any) {
	const sheets = google.sheets({ version: 'v4', auth });
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId: '1-YkCeynx_-KYdubvt14augSPo37_20YgUv_f-i8HVwY',
		range: 'al_ko_mit_govor',
	});

	const rows = res.data.values;

	const keys_res = await sheets.spreadsheets.values.get({
		spreadsheetId: '1-YkCeynx_-KYdubvt14augSPo37_20YgUv_f-i8HVwY',
		range: 'klucz',
	});

	const keys = keys_res.data.values;

	if (!rows || rows.length === 0) {
		console.log('No data found.');
		return;
	}
	if (!keys || keys.length === 0) {
		console.log('No lemma keys found.');
		return;
	}

	const lects = rows.shift();

	if (lects == undefined) {
		console.error('Lects is undefined');
		return;
	}

	if (keys.length != rows.length) {
		console.log("Lemma count doesn't match number of rows.");
		return;
	}

	for (const lect of lects) {
		let l = new Lect();
		l.name = lect;
		l.save();
		console.log(l);
	}

	for (let i = 0; i < rows.length; i++) {
		const row: string[] = rows[i];
		const lemma_key: string = keys[i][0];

		const lemma = new Lemma();
		if (lemma_key == null || lemma_key.length == 0) {
			//assign a random UUID to the lemma as punishment for our failures
			lemma.lemma_name = crypto.randomUUID();
			console.log(
				`womp womp, missing lemma name, calling it ${lemma.lemma_name}`
			);
		} else {
			lemma.lemma_name = lemma_key;
		}

		console.log(lemma);
		await lemma.save();

		for (let i = 0; i < rows.length; i++) {
			const cell = row[i];
			if (
				cell === null ||
				cell === undefined ||
				(typeof cell === 'string' && cell.length === 0)
			) {
				continue;
			}

			for (let word_form of cell.split(';')) {
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
