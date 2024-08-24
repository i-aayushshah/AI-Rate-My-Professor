// components/ProfessorCard.js
import React, { useState } from 'react';
import { Star, Bookmark, MessageCircle, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';


const ProfessorCard = ({ professor }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const reviews = Array.isArray(professor.reviews) ? professor.reviews : JSON.parse(professor.reviews || '[]');

  const toggleReviews = () => setShowAllReviews(!showAllReviews);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically also update this state in your backend or local storage
    // For example:
    // updateBookmarkStatus(professor.id, !isBookmarked);
  };

  return (
    <Card className="w-80 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="relative pb-0">
        <button
          onClick={toggleBookmark}
          className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow-md transition-colors duration-300 ${isBookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
        >
          <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={professor.avatar || '/user.png'}
              alt={professor.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{professor.name}</h2>
            <p className="text-sm text-gray-600">
              {professor.university} • {professor.department}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {professor.teaching_style && (
          <div className="mb-3">
            <h3 className="text-md font-semibold flex items-center">
              <Award className="w-4 h-4 mr-2 text-purple-500" />
              Teaching Style
            </h3>
            <p className="text-sm text-gray-700 ml-6">{professor.teaching_style}</p>
          </div>
        )}
        {professor.expertise && professor.expertise.length > 0 && (
          <div className="mb-3">
            <h3 className="text-md font-semibold mb-1">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {professor.expertise.map((item, index) => (
                <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-md font-semibold flex items-center mb-2">
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            Reviews
          </h3>
          {reviews.length > 0 ? (
            <>
              <div className="bg-gray-50 p-3 rounded-lg mb-2">
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-semibold text-sm">{reviews[0].rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{reviews[0].text}"</p>
                <p className="text-xs text-gray-500 mt-1">{reviews[0].date}</p>
              </div>
              {showAllReviews && reviews.slice(1).map((review, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex items-center mb-1">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-semibold text-sm">{review.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                  <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                </div>
              ))}
              {reviews.length > 1 && (
                <button
                  onClick={toggleReviews}
                  className="text-blue-500 hover:text-blue-600 text-sm font-semibold flex items-center"
                >
                  {showAllReviews ? 'Show Less' : `View ${reviews.length - 1} More Reviews`}
                  {showAllReviews ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No reviews yet</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-gray-50">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="font-semibold text-lg">{professor.rating.toFixed(1)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfessorCard;
