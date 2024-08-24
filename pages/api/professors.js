import { PineconeManager } from '../../utils/api';

export default async function handler(req, res) {
  const pineconeManager = new PineconeManager();

  if (req.method === 'GET') {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is missing' });
    }

    const allProfessors = await pineconeManager.search('');
    const filteredResults = allProfessors.filter(professor =>
      professor.name.toLowerCase().includes(query.toLowerCase()) ||
      professor.university.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(filteredResults);
  } else if (req.method === 'POST') {
    const { link } = req.body;
    const result = await pineconeManager.insertFromLink(link);
    res.status(200).json(result);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
