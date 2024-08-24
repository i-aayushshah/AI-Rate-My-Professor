import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pinecone_manager import PineconeManager
import json

class RecommendationEngine:
    def __init__(self):
        self.pinecone_manager = PineconeManager()

    def get_recommendations(self, criteria):
        professors = self.fetch_professors(criteria)

        if not professors:
            return []

        feature_vectors = [self.generate_feature_vector(prof) for prof in professors]

        similarity_matrix = cosine_similarity(feature_vectors)

        recommendations = []
        for i, prof in enumerate(professors):
            similar_indices = similarity_matrix[i].argsort()[::-1][1:6]
            similar_professors = [professors[j] for j in similar_indices]
            recommendations.append({
                'professor': prof,
                'similar_professors': similar_professors
            })

        return recommendations

    def fetch_professors(self, criteria):
        query = self.criteria_to_query(criteria)
        results = self.pinecone_manager.search(query)

        professors = []
        for result in results:
            professor = {
                'id': result.get('id', ''),
                'name': result.get('name', ''),
                'university': result.get('university', ''),
                'department': result.get('department', ''),
                'rating': result.get('rating', 0),
                'expertise': result.get('expertise', []),
                'teaching_style': result.get('teaching_style', ''),
                'reviews': json.loads(result.get('reviews', '[]'))
            }
            professors.append(professor)

        return professors

    def criteria_to_query(self, criteria):
        query_parts = []
        for key, value in criteria.items():
            if isinstance(value, list):
                query_parts.extend([f"{key}:{v}" for v in value])
            else:
                query_parts.append(f"{key}:{value}")
        return " ".join(query_parts)

    def generate_feature_vector(self, prof):
        expertise_vector = self.expertise_to_vector(prof.get('expertise', []))
        teaching_style_vector = self.teaching_style_to_vector(prof.get('teaching_style', ''))

        reviews = prof.get('reviews', [])
        if isinstance(reviews, str):
            try:
                reviews = json.loads(reviews)
            except json.JSONDecodeError:
                reviews = []

        return np.array([
            float(prof.get('rating', 0)),
            len(prof.get('expertise', [])),
            np.mean([float(review.get('rating', 0)) for review in reviews]) if reviews else 0,
            *expertise_vector,
            *teaching_style_vector
        ])

    def expertise_to_vector(self, expertise_list):
        all_expertise = ['Machine Learning', 'Data Science', 'Web Development', 'Algorithms',
                         'Artificial Intelligence', 'Database Systems', 'Computer Networks',
                         'Software Engineering', 'Cybersecurity', 'Computer Graphics']
        return [1 if exp in expertise_list else 0 for exp in all_expertise]

    def teaching_style_to_vector(self, teaching_style):
        styles = ['Interactive', 'Lecture-based', 'Project-based', 'Flipped classroom',
                  'Discussion-based', 'Lab-based', 'Problem-based learning', 'Team-based learning']
        return [1 if teaching_style == style else 0 for style in styles]
