from textblob import TextBlob
from pinecone_manager import PineconeManager

class SentimentAnalyzer:
    def __init__(self):
        self.pinecone_manager = PineconeManager()

    def analyze(self, professor_id):
        professor_data = self.pinecone_manager.search(f"id:{professor_id}")[0]

        if not professor_data:
            return None

        reviews = professor_data.get('reviews', [])
        sentiments = [self.analyze_review(review) for review in reviews]

        return {
            'professor_id': professor_id,
            'overall_sentiment': self.calculate_overall_sentiment(sentiments),
            'sentiment_distribution': self.calculate_sentiment_distribution(sentiments)
        }

    def analyze_review(self, review):
        blob = TextBlob(review['text'])
        return blob.sentiment.polarity

    def calculate_overall_sentiment(self, sentiments):
        if not sentiments:
            return 0
        return sum(sentiments) / len(sentiments)

    def calculate_sentiment_distribution(self, sentiments):
        positive = sum(1 for s in sentiments if s > 0.1)
        neutral = sum(1 for s in sentiments if -0.1 <= s <= 0.1)
        negative = sum(1 for s in sentiments if s < -0.1)

        total = len(sentiments)
        return {
            'positive': positive / total if total > 0 else 0,
            'neutral': neutral / total if total > 0 else 0,
            'negative': negative / total if total > 0 else 0
        }
