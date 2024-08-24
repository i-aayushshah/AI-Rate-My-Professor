// components/ProfessorCard.js
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const ProfessorCard = ({ professor }) => {
  // Deserialize reviews from JSON string
  const reviews = Array.isArray(professor.reviews) ? professor.reviews : JSON.parse(professor.reviews || '[]');

  return (
    <Card className="w-64 shadow-lg">
      <CardHeader className="text-lg font-bold">{professor.name}</CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {professor.university} || {professor.department}
        </p>
        {professor.teaching_style && (
          <div className="mt-2">
            <h3 className="text-md font-semibold">Teaching Style:</h3>
            <p className="text-sm text-gray-700">{professor.teaching_style}</p>
          </div>
        )}
        {professor.expertise && professor.expertise.length > 0 && (
          <div className="mt-2">
            <h3 className="text-md font-semibold">Expertise:</h3>
            <ul className="list-disc pl-5">
              {professor.expertise.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {reviews.length > 0 && (
          <div className="mt-2">
            <h3 className="text-md font-semibold">Reviews:</h3>
            <ul className="list-disc pl-5">
              {reviews.map((review, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <p><strong>Rating:</strong> {review.rating}</p>
                  <p><strong>Review:</strong> {review.text}</p>
                  <p><strong>Date:</strong> {review.date}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <Star className="w-5 h-5 text-yellow-400 mr-1" />
        <span className="font-semibold">{professor.rating.toFixed(1)}</span>
      </CardFooter>
    </Card>
  );
};

export default ProfessorCard;
