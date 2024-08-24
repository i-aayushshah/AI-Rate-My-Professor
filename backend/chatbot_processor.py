import google.generativeai as genai
from pinecone_manager import PineconeManager
import re
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from sentiment_analyzer import SentimentAnalyzer
from recommendation_engine import RecommendationEngine
import json


nltk.download('vader_lexicon')  # Ensure NLTK sentiment analyzer is downloaded

class ChatbotProcessor:
    def __init__(self):
        # Configure Google Generative AI
        genai.configure(api_key="AIzaSyBgTLInXBrx-mhdLStDlFfknwizmWFKb8I")
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat = self.model.start_chat(history=[])

        self.pinecone_manager = PineconeManager()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.custom_sentiment_analyzer = SentimentAnalyzer()
        self.recommendation_engine = RecommendationEngine()

    def fetch_data_from_pinecone(self, query):
        pinecone_results = self.pinecone_manager.search(query)
        return pinecone_results

    def handle_greeting(self, message):
        # Advanced greeting detection
        greetings = [
            r"\bhi\b", r"\bhello\b", r"\bhey\b", r"\bgreetings\b",
            r"\bgood morning\b", r"\bgood afternoon\b", r"\bgood evening\b"
        ]
        if any(re.search(greeting, message, re.IGNORECASE) for greeting in greetings):
            return "Hello! How can I assist you today?"
        return None

    def handle_sentiment(self, message):
        # Analyze the sentiment of the message
        sentiment_score = self.sentiment_analyzer.polarity_scores(message)['compound']
        if sentiment_score >= 0.5:
            return "It sounds like you're in a great mood today! How can I help you?"
        elif sentiment_score <= -0.5:
            return "I'm sorry to hear you're feeling down. How can I assist you?"
        return None

    def analyze_professor_sentiment(self, professor_id):
        sentiment_data = self.custom_sentiment_analyzer.analyze(professor_id)
        if sentiment_data:
            sentiment_summary = sentiment_data.get('sentiment_summary', 'No sentiment summary available.')
            positive_reviews = sentiment_data.get('positive_reviews', [])
            negative_reviews = sentiment_data.get('negative_reviews', [])

            formatted_sentiment = [
                f"Sentiment about Prof. {sentiment_data.get('professor_name', 'Unknown')}:",
                sentiment_summary,
                "Positive Reviews:"
            ]

            if positive_reviews:
                formatted_sentiment.extend([f"- {review}" for review in positive_reviews])
            else:
                formatted_sentiment.append("- No positive reviews available.")

            formatted_sentiment.append("Negative Reviews:")
            if negative_reviews:
                formatted_sentiment.extend([f"- {review}" for review in negative_reviews])
            else:
                formatted_sentiment.append("- No negative reviews available.")

            return "\n".join(formatted_sentiment)
        return "Unable to analyze sentiment for the given professor ID."

    def get_professor_recommendations(self, criteria):
        recommendations = self.recommendation_engine.get_recommendations(criteria)
        if recommendations:
            formatted_recommendations = ["Based on your criteria, here are some professor recommendations:"]
            for i, rec in enumerate(recommendations, 1):
                prof = rec['professor']
                prof_info = [
                    f"{i}. Professor {prof['name']}",
                    f"University: {prof['university']}",
                    f"Department: {prof['department']}",
                    f"Rating: {prof.get('rating', 'N/A')}/5.0",
                    f"Expertise: {', '.join(prof.get('expertise', ['N/A']))}",
                    f"Teaching Style: {prof.get('teaching_style', 'N/A')}",
                    f"Student Feedback: {prof.get('student_feedback', 'N/A')}",
                    f"Similar Professors: {', '.join([sim_prof['name'] for sim_prof in rec['similar_professors']])}"
                ]

                if 'sample_review' in prof:
                    prof_info.append(f"Sample Student Review: \"{prof['sample_review']}\"")

                formatted_recommendations.append("\n".join(prof_info))
                formatted_recommendations.append("---")

            return "\n\n".join(formatted_recommendations)
        return "I'm sorry, but I couldn't find any recommendations based on your criteria. Could you please provide more details or try different criteria?"

    def get_top_rated_faculty(self):
        # Fetch top-rated faculty from Pinecone
        top_rated_results = self.pinecone_manager.search(query="rating:>=4.5")  # Assuming 'rating:>=4.5' will query top-rated faculty
        return self.format_pinecone_results(top_rated_results)

    def format_pinecone_results(self, results):
        if not results:
            return "I couldn't find any relevant information at the moment."

        formatted_results = []
        for result in results:
            name = result.get('name', 'N/A')
            university = result.get('university', 'N/A')
            department = result.get('department', 'N/A')
            rating = result.get('rating', 'N/A')
            expertise = result.get('expertise', [])
            teaching_style = result.get('teaching_style', 'N/A')
            reviews = json.loads(result.get('reviews', '[]'))

            prof_info = [
                f"Prof. {name}",
                f"University: {university}",
                f"Department: {department}",
                f"Rating: {rating}",
                f"Expertise: {', '.join(expertise)}",
                f"Teaching Style: {teaching_style}"
            ]

            if reviews:
                prof_info.append("Reviews:")
                for review in reviews:
                    prof_info.append(f"- {review['text']} (Rating: {review['rating']}, Date: {review['date']})")
            else:
                prof_info.append("Reviews: No reviews available.")

            formatted_results.append("\n".join(prof_info))

        return "\n\n".join(formatted_results)

    def extract_professor_id(self, message):
        # Extract professor ID from the message
        match = re.search(r'professor id (\d+)', message, re.IGNORECASE)
        if match:
            return match.group(1)
        return None

    def extract_criteria(self, message):
        # Extract criteria from the message
        # Implement extraction logic based on the message content
        return {"criteria": message}

    def process(self, message):
        # Handle greetings and sentiment first
        greeting_response = self.handle_greeting(message)
        if greeting_response:
            return greeting_response

        sentiment_response = self.handle_sentiment(message)
        if sentiment_response:
            return sentiment_response

        # Provide top-rated faculty
        if "top-rated faculty" in message.lower():
            return self.get_top_rated_faculty()

        # Fetch and format data from Pinecone
        pinecone_results = self.fetch_data_from_pinecone(message)
        formatted_info = self.format_pinecone_results(pinecone_results)

        # Analyze sentiment of a specific professor
        if "analyze sentiment" in message.lower():
            professor_id = self.extract_professor_id(message)
            sentiment_analysis = self.analyze_professor_sentiment(professor_id)
            return sentiment_analysis

        # Provide professor recommendations
        if any(keyword in message.lower() for keyword in ["recommend", "suggestion", "best professor"]):
            criteria = self.extract_criteria(message)
            recommendations = self.get_professor_recommendations(criteria)
            return recommendations

        # Get response from Generative AI
        enriched_message = f"{message}\n\nRelevant Information:\n{formatted_info}"
        response = self.chat.send_message(enriched_message)
        return response.text
