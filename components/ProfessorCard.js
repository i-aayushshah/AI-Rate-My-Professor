// components/ProfessorCard.js
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const ProfessorCard = ({ professor }) => {
  return (
    <Card className="w-64 shadow-lg">
      <CardHeader className="text-lg font-bold">{professor.name}</CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{professor.university} || {professor.department}</p>
        {professor.reviews && professor.reviews.length > 0 && (
          <div className="mt-2">
            <h3 className="text-md font-semibold">Reviews:</h3>
            <ul className="list-disc pl-5">
              {professor.reviews.map((review, index) => (
                <li key={index} className="text-sm text-gray-700">{review}</li>
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
