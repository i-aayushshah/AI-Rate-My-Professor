import { useState } from 'react';
import { PineconeManager } from '../utils/api';

export default function SubmitProfessorLink() {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pineconeManager = new PineconeManager();
    try {
      const result = await pineconeManager.insertFromLink(link);
      setMessage('Professor data added successfully!');
      setLink('');
    } catch (error) {
      setMessage('Error adding professor data. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter Rate My Professor link..."
          className="input-primary mr-2"
          required
        />
        <button type="submit" className="btn-primary">Submit</button>
      </form>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
