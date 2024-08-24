import { PineconeManager } from '../../utils/api';

export default async function handler(req, res) {
  const pineconeManager = new PineconeManager();

  if (req.method === 'GET') {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is missing' });
    }

    try {
      const allProfessors = await pineconeManager.search('');

      // Filtering based on name, university, and department
      const filteredResults = allProfessors.filter(professor =>
        professor.name.toLowerCase().includes(query.toLowerCase()) ||
        professor.university.toLowerCase().includes(query.toLowerCase()) ||
        professor.department.toLowerCase().includes(query.toLowerCase())
      );

      res.status(200).json(filteredResults);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch professors' });
    }
  } else if (req.method === 'POST') {
    const { link } = req.body;

    try {
      const result = await pineconeManager.insertFromLink(link);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert data from link' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
