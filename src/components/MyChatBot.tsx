import React from "react";
import ChatBot from "react-chatbotify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Params } from "../types/Params";
import { Flow } from "../types/Flow"

const MyChatBot = () => {
	const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

	async function run(prompt: string, streamMessage: (content: string) => void): Promise<string> {
		// For text-only input, use the gemini-pro model
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });

		const result = await model.generateContentStream(prompt);
		let text = '';
		for await (const chunk of result.stream) {
			const chunkText = chunk.text();
			text += chunkText;
			streamMessage(text);
		}
		return text;
	}

	const flow: Flow = {
		start: {
			message: "Hello, I am sentient now, talk to me!",
			path: "model_loop",
		},
		model_loop: {
			message: async (params: Params) => {
				return await run(params.userInput, params.streamMessage);
			},
			path: "model_loop"
		},
	};

	return (
		<ChatBot flow={flow} />
	);
};

export default MyChatBot;
