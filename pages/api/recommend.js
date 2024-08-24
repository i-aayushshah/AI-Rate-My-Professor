import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { criteria } = req.body;
      const response = await axios.post(`${API_BASE_URL}/api/recommend`, { criteria });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching recommendations' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
