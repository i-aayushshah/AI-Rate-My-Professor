import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export class PineconeManager {
  async search(query) {
    const response = await axios.get(`${API_BASE_URL}/api/professors`, { params: { query } });
    return response.data;
  }

  async insertFromLink(link) {
    const response = await axios.post(`${API_BASE_URL}/api/professors`, { link });
    return response.data;
  }
}

export class ChatbotProcessor {
  async process(message) {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, { message });
    return response.data.reply;
  }
}
