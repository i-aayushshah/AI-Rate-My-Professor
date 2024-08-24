import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { professor_id } = req.query;
      const response = await axios.get(`${API_BASE_URL}/api/sentiment`, { params: { professor_id } });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error analyzing sentiment' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
