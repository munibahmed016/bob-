import OpenAI from "openai";

const apiKey = `sk-proj-czPrxrRcoKuZ4QWYIr2oT3BlbkFJaNP03ZCeuIt03wb4OI80`; // Replace with your actual OpenAI API key
const modelType = "gpt-4";

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // This is only for testing on the browser side
});

export async function getOpenAIResponse(userMessage: string, systemMessage: string) {
    const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
    ];

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: messages as any, // Temporary cast to bypass type error
            model: modelType,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return "I'm sorry, I couldn't process your request.";
    }
}
