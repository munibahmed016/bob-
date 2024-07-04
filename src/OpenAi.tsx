import axios from 'axios';

const OPENAI_API_KEY = `sk-proj-czPrxrRcoKuZ4QWYIr2oT3BlbkFJaNP03ZCeuIt03wb4OI80`;

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  }
});

export const getOpenAIResponse = async (userInput: string) => {
  try {
    const response = await openai.post('/completions', {
      model: 'text-davinci-003',
      prompt: userInput,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.5,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    throw new Error('Error fetching response from OpenAI');
  }
};