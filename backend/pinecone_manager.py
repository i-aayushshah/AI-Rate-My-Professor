import json
import numpy as np
from pinecone import Pinecone, ServerlessSpec

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
        results = self.index.query(vector=query_vector, top_k=50, include_metadata=True)
        return [match['metadata'] for match in results['matches']]

    def insert(self, professor_data):
        vector = self.generate_vector(professor_data)
        metadata = {
            'id': professor_data['id'],
            'name': professor_data.get('name', ''),
            'university': professor_data.get('university', ''),
            'department': professor_data.get('department', ''),
            'rating': professor_data.get('rating', 0),
            'expertise': professor_data.get('expertise', []),
            'teaching_style': professor_data.get('teaching_style', ''),
            'reviews': self.serialize_reviews(professor_data.get('reviews', []))
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
                'expertise': professor.get('expertise', []),
                'teaching_style': professor.get('teaching_style', ''),
                'reviews': self.serialize_reviews(professor.get('reviews', []))
            }
            vectors.append((professor['id'], vector, metadata))
        self.index.upsert(vectors=vectors)
        return {"message": "Bulk professor data added successfully"}

    def generate_vector(self, data):
        # Combine relevant fields into a single text string
        text = f"{data.get('name', '')} {data.get('university', '')} {data.get('department', '')} {data.get('teaching_style', '')} {' '.join(data.get('expertise', []))} {' '.join([review['text'] for review in data.get('reviews', [])])}"
        # Convert text to vector representation
        vector = np.array([float(ord(c)) for c in text.lower() if ord(c) < 128], dtype=float)
        vector = np.pad(vector, (0, 768 - len(vector)), 'constant')
        return vector.tolist()

    def serialize_reviews(self, reviews):
        # Convert review list to a string
        return json.dumps([
            {
                'rating': review.get('rating', 0),
                'text': review.get('text', ''),
                'date': review.get('date', '')
            }
            for review in reviews
        ])

def load_data_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def main():
    manager = PineconeManager()

    # Load data from JSON file
    professors = load_data_from_json('data.json')

    # Insert data into Pinecone
    response = manager.insert_bulk(professors)
    print(response)

if __name__ == "__main__":
    main()
