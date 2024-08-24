from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pinecone_manager import PineconeManager
from professor_scraper import ProfessorScraper
from sentiment_analyzer import SentimentAnalyzer
from recommendation_engine import RecommendationEngine
from chatbot_processor import ChatbotProcessor
import os

load_dotenv()  # This loads the environment variables from .env

app = Flask(__name__)
CORS(app)

try:
    pinecone_manager = PineconeManager()
except Exception as e:
    print(f"Error initializing PineconeManager: {str(e)}")
    print(f"PINECONE_API_KEY: {os.environ.get('PINECONE_API_KEY')}")
    print(f"PINECONE_ENVIRONMENT: {os.environ.get('PINECONE_ENVIRONMENT')}")
    raise

professor_scraper = ProfessorScraper()
sentiment_analyzer = SentimentAnalyzer()
recommendation_engine = RecommendationEngine()
chatbot_processor = ChatbotProcessor()



@app.route('/api/professors', methods=['GET'])
def search_professors():
    query = request.args.get('query')
    results = pinecone_manager.search(query)
    return jsonify(results)

@app.route('/api/professors', methods=['POST'])
def submit_professor_link():
    link = request.json['link']
    professor_data = professor_scraper.scrape(link)
    result = pinecone_manager.insert(professor_data)
    return jsonify(result)

@app.route('/api/recommend', methods=['POST'])
def recommend_professors():
    criteria = request.json['criteria']
    recommendations = recommendation_engine.get_recommendations(criteria)
    return jsonify(recommendations)

@app.route('/api/sentiment', methods=['GET'])
def analyze_sentiment():
    professor_id = request.args.get('professor_id')
    sentiment_data = sentiment_analyzer.analyze(professor_id)
    return jsonify(sentiment_data)

@app.route('/api/chat', methods=['POST'])
def chat():
    message = request.json['message']
    reply = chatbot_processor.process(message)
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(debug=True)
