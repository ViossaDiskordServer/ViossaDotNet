import { promises as fs } from "fs";
import * as path from "path";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { JWTInput, OAuth2Client } from "google-auth-library";
import {
	GoogleAuth,
	JSONClient,
} from "google-auth-library/build/src/auth/googleauth.js";
import z from "zod";

//setup google auth
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "res/token.secret.json");
const CREDENTIALS_PATH = path.join(
	process.cwd(),
	"res/credentials.secret.json",
);

/**
 * Load or request or authorization to call APIs.
 */
export async function authorize(): Promise<
	GoogleAuth<JSONClient> | OAuth2Client
> {
	const savedClient = await loadSavedCredentialsIfExist();
	if (savedClient) {
		return savedClient;
	}

	const oauthClient = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});

	if (oauthClient.credentials) {
		await saveCredentials(oauthClient);
	}

	return oauthClient;
}

const jwtInputZod = z.object({
	type: z.string(),
	client_id: z.string(),
	client_secret: z.string(),
	refresh_token: z.string(),
}) satisfies z.ZodType<JWTInput>;

async function loadSavedCredentialsIfExist(): Promise<GoogleAuth<JSONClient> | null> {
	try {
		const content = await fs.readFile(TOKEN_PATH);
		const jwtInputRaw = JSON.parse(content.toString());

		const jwtInputRes = jwtInputZod.safeParse(jwtInputRaw);
		if (!jwtInputRes.success) {
			throw new Error("Malformed JWT/token credentials");
		}

		const jwtInput = jwtInputRes.data;
		const jsonClient = google.auth.fromJSON(jwtInput);
		const auth = new GoogleAuth({ authClient: jsonClient });
		return auth;
	} catch (err) {
		return null;
	}
}

const credentialsZod = z.object({
	installed: z.object({
		client_id: z.string(),
		project_id: z.string(),
		auth_uri: z.string(),
		token_uri: z.string(),
		auth_provider_x509_cert_url: z.string(),
		client_secret: z.string(),
		redirect_uris: z.array(z.string()),
	}),
	web: z.optional(
		z.object({
			client_id: z.string(),
			project_id: z.string(),
			auth_uri: z.string(),
			token_uri: z.string(),
			auth_provider_x509_cert_url: z.string(),
			client_secret: z.string(),
			redirect_uris: z.array(z.string()),
		}),
	),
});

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
	const content = await fs.readFile(CREDENTIALS_PATH);
	const keysRaw = JSON.parse(content.toString());

	const keysRes = credentialsZod.safeParse(keysRaw);
	if (!keysRes.success) {
		throw new Error("Malformed credentials/keys");
	}

	const keys = keysRes.data;
	const key = keys.installed ?? keys.web;
	const payload = JSON.stringify({
		type: "authorized_user",
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});

	await fs.writeFile(TOKEN_PATH, payload);
}
