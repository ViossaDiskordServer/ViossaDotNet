import { SAMPLE } from "@repo/common/sample";
import express from "express";

const PORT = 1225;

const app = express();

app.get("/sample", (_req, res) => {
	res.status(200).send(SAMPLE);
});

app.listen(PORT, () => {
	console.log(`Backend started @ http://localhost:${PORT} !`);
	console.log(SAMPLE);
});
