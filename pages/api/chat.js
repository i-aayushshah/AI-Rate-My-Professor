import { ChatbotProcessor } from '../../utils/api';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const chatbotProcessor = new ChatbotProcessor();
    const { message } = req.body;
    const reply = await chatbotProcessor.process(message);
    res.status(200).json({ reply });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
