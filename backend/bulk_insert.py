import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from pinecone_manager import PineconeManager

def bulk_insert_professor_data():
    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'professor_data.json'))

    print(f"Loading professor data from: {json_path}")

    with open(json_path, 'r') as file:
        professors = json.load(file)

    pinecone_manager = PineconeManager()

    result = pinecone_manager.insert_bulk(professors)
    print(result)

if __name__ == '__main__':
    bulk_insert_professor_data()
