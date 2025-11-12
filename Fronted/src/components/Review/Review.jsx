import React,{useState} from 'react'
import axios from 'axios'

function Review({id}) {
    const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating ==0) {
        alert('Please select rating')
        return;
    }

    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('token');

        const res = await axios.post(`/api/reviews/${id}`, 
            {rating, comment, isRecommended},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setRating(0);
        setComment("");
        setIsRecommended(false);

    } catch (error) {
        alert(error.response?.data?.message || "Failed to add review ❌");
    } finally{
        setIsSubmitting(false);
    }
 };

    // Star rating component
    const StarRating = () => {
        return (
             <div className="flex flex-col items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How would you rate this product?</h3>
        <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                 key={star}
                 type='button'
                 onClick={() => setRating(star)}
                 onMouseEnter={() => setHoverRating(star)}
                 onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform duration-200 hover:scale-110 focus:outline-none"
            >
                <span className={`
                 ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"}
                `}>
                    ★
                </span>
            </button>
            ))}
        </div>
         <p className="text-sm text-gray-600">
          {rating === 0 ? "Select a rating" : `${rating} out of 5 stars`}
        </p>
         <input
          type="hidden"
          value={rating}
          required
        />
        </div>
        );
    };
  return (
     <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-medium">Review added successfully!</p>
              <p className="text-green-600 text-sm">Thank you for sharing your experience.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
        <p className="text-gray-600">Your review helps others make better decisions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <StarRating />

        {/* Comment Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Share your thoughts
            </div>
          </label>
          <textarea
            placeholder="What did you like or dislike? What did you use this product for?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
            required
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Be specific and honest</span>
            <span>{comment.length}/500</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                isRecommended 
                  ? 'bg-green-500 border-green-500' 
                  : 'bg-white border-gray-300'
              }`}>
                {isRecommended && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-800">I recommend this product</span>
              <p className="text-sm text-gray-600 mt-1">
                Let others know if you're happy with your purchase
              </p>
            </div>
            {isRecommended && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                👍 Recommended
              </div>
            )}
          </label>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Writing a great review
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Mention specific features you liked or disliked</li>
            <li>• Include how you're using the product</li>
            <li>• Be honest and detailed about your experience</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Review...
            </div>
          ) : (
            "Submit Review"
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center">
          Your review will be publicly visible. By submitting, you agree to our review guidelines.
        </p>
      </form>
    </div>
  );
}

export default Review