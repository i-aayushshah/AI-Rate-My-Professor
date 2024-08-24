import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class RecommendationEngine:
    def __init__(self):
        pass

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
        # This method should interact with your database to fetch professors
        # based on the given criteria. For now, we'll return a dummy list.
        return [
            {
                'name': 'John Doe',
                'university': 'Example University',
                'department': 'Computer Science',
                'rating': 4.5,
                'expertise': ['Machine Learning', 'Data Science'],
                'teaching_style': 'Interactive',
                'reviews': [
                    {'rating': 5, 'comment': 'Great professor!'},
                    {'rating': 4, 'comment': 'Very knowledgeable.'}
                ]
            },
            # Add more professor data as needed
        ]

    def generate_feature_vector(self, prof):
        expertise_vector = self.expertise_to_vector(prof.get('expertise', []))
        teaching_style_vector = self.teaching_style_to_vector(prof.get('teaching_style', ''))

        reviews = prof.get('reviews', [])
        if isinstance(reviews, str):
            try:
                reviews = eval(reviews)
            except:
                reviews = []

        return np.array([
            float(prof.get('rating', 0)),
            len(prof.get('expertise', [])),
            np.mean([float(review.get('rating', 0)) for review in reviews]) if reviews else 0,
            *expertise_vector,
            *teaching_style_vector
        ])

    def expertise_to_vector(self, expertise_list):
        all_expertise = ['Machine Learning', 'Data Science', 'Web Development', 'Algorithms']
        return [1 if exp in expertise_list else 0 for exp in all_expertise]

    def teaching_style_to_vector(self, teaching_style):
        styles = ['Interactive', 'Lecture-based', 'Project-based', 'Flipped classroom']
        return [1 if teaching_style == style else 0 for style in styles]
