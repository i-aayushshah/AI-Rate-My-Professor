import requests
from bs4 import BeautifulSoup
import uuid

class ProfessorScraper:
    def scrape(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raises an HTTPError if the response was unsuccessful
        except requests.RequestException as e:
            raise RuntimeError(f"Error fetching URL: {e}")

        soup = BeautifulSoup(response.content, 'html.parser')

        professor_data = {
            'id': str(uuid.uuid4()),
            'name': self.extract_name(soup),
            'university': self.extract_university(soup),
            'department': self.extract_department(soup),
            'rating': self.extract_rating(soup),
            'expertise': self.extract_expertise(soup),
            'teaching_style': self.extract_teaching_style(soup),
            'reviews': self.extract_reviews(soup)
        }

        return professor_data

    def extract_name(self, soup):
        name_element = soup.find('div', class_='NameTitle__Name-sc-19hajbo-0')
        return name_element.text.strip() if name_element else ''

    def extract_university(self, soup):
        university_element = soup.find('a', class_='SchoolLink__StyledSchoolLink-sc-1rvdtjg-0')
        return university_element.text.strip() if university_element else ''

    def extract_department(self, soup):
        department_element = soup.find('div', class_='NameTitle__Title-sc-19hajbo-1')
        return department_element.text.strip() if department_element else ''

    def extract_rating(self, soup):
        rating_element = soup.find('div', class_='RatingValue__Numerator-qw8sqy-2')
        return float(rating_element.text.strip()) if rating_element else 0.0

    def extract_expertise(self, soup):
        expertise_elements = soup.find_all('div', class_='ExpertiseClass')  # Adjust the class as needed
        return [expertise_element.text.strip() for expertise_element in expertise_elements]

    def extract_teaching_style(self, soup):
        teaching_style_element = soup.find('div', class_='TeachingStyleClass')  # Adjust the class as needed
        return teaching_style_element.text.strip() if teaching_style_element else ''

    def extract_reviews(self, soup):
        reviews = []
        review_elements = soup.find_all('div', class_='Rating__RatingBody-sc-1rhvpxz-0')
        for review_element in review_elements:
            review = {
                'rating': self.extract_review_rating(review_element),
                'text': self.extract_review_text(review_element),
                'date': self.extract_review_date(review_element)
            }
            reviews.append(review)
        return reviews

    def extract_review_rating(self, review_element):
        rating_element = review_element.find('div', class_='Rating__RatingNumber-sc-1rhvpxz-1')
        return float(rating_element.text.strip()) if rating_element else 0.0

    def extract_review_text(self, review_element):
        text_element = review_element.find('div', class_='Comments__StyledComments-dzzyvm-0')
        return text_element.text.strip() if text_element else ''

    def extract_review_date(self, review_element):
        date_element = review_element.find('div', class_='TimeStamp__StyledTimeStamp-sc-9q2r30-0')
        return date_element.text.strip() if date_element else ''
