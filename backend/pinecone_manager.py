import os
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()  
class PineconeManager:
    def __init__(self):
        api_key = "97b9f6bc-d6c4-452e-9248-f7cfe96c80df"
        environment = "us-east-1-aws"

        if not api_key or not environment:
            raise ValueError("Pinecone API key or environment not set in environment variables")

        self.pc = Pinecone(api_key=api_key, environment=environment)
        self.index_name = "professors"

        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=768,
                metric='euclidean',
                spec=ServerlessSpec(cloud='aws', region='us-east-1')
            )

        self.index = self.pc.Index(self.index_name)

    def search(self, query):
        query_vector = self.generate_vector({"text": query})
        results = self.index.query(vector=query_vector, top_k=10, include_metadata=True)
        return [match['metadata'] for match in results['matches']]

    def insert(self, professor_data):
        vector = self.generate_vector(professor_data)
        metadata = {
            'id': professor_data['id'],
            'name': professor_data.get('name', ''),
            'university': professor_data.get('university', ''),
            'department': professor_data.get('department', ''),
            'rating': professor_data.get('rating', 0),
            'reviews': [review['text'] for review in professor_data.get('reviews', [])]
        }
        self.index.upsert(vectors=[(professor_data['id'], vector, metadata)])
        return {"message": "Professor data added successfully"}

    def insert_bulk(self, professors):
        vectors = []
        for professor in professors:
            vector = self.generate_vector(professor)
            metadata = {
                'id': professor['id'],
                'name': professor.get('name', ''),
                'university': professor.get('university', ''),
                'department': professor.get('department', ''),
                'rating': professor.get('rating', 0),
                'reviews': [review['text'] for review in professor.get('reviews', [])]
            }
            vectors.append((professor['id'], vector, metadata))
        self.index.upsert(vectors=vectors)
        return {"message": "Bulk professor data added successfully"}

    def generate_vector(self, data):
        text = f"{data.get('name', '')} {data.get('university', '')} {data.get('department', '')} {data.get('text', '')}"
        vector = np.array([float(ord(c)) for c in text.lower() if ord(c) < 128], dtype=float)
        vector = np.pad(vector, (0, 768 - len(vector)), 'constant')
        return vector.tolist()
