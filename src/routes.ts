import { type Static, Type } from "@fastify/type-provider-typebox";

import type { ServerInstance } from "./server.js";
import { getPrediction } from "./prediction.js";

const PredictionType = Type.Object({
	neutral: Type.Number(),
	drawing: Type.Number(),
	porn: Type.Number(),
	sexy: Type.Number(),
	hentai: Type.Number(),
});

export type Prediction = Static<typeof PredictionType>;

export default async function routes(fastify: ServerInstance) {
	fastify.get("/_health", async () => {
		return { status: "ok" };
	});

	fastify.post("/classify", async (req, res) => {
		const file = await req.file();
		if (!file) {
			return res.status(400).send({ error: "Missing file" });
		}

		const imageBuffer = await file.toBuffer();

		try {
			const prediction = await getPrediction(imageBuffer);
			return res.send({ prediction });
		} catch (err) {
			console.error(err);
			return res.status(500).send({ error: "Internal Server Error" });
		}
	});
}
