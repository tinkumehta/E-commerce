import axios from 'axios';
import React, { useEffect, useState } from 'react'

function GetReview({productId}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({average: 0, total: 0, distribution: []});

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews/${productId}`);
                setReviews(res.data);

                // Calculate review statistics
                if (res.data.length > 0) {
                    const average = res.data.reduce((acc, review) => acc +review.rating, 0) / res.data.length;
                    const distribution = [0, 0,0, 0, 0];
                    res.data.forEach(review => {
                        distribution[review.rating -1]++;
                    });

                    setStats({
                        average: average.toFixed(1),
                        total: res.data.length,
                        distribution: distribution.map(count => (count / res.data.length) *100)
                    });
                }
            } catch (error) {
                console.error("Failed to load reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    },[productId]);

    // function to render stars
    const renderStars = (rating, size = 'w-5 h-5') => {
        return [...Array(5)].map((_,i) => (
             <svg
                key={i}
                className={`${size} ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.2 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.127 2.27a1 1 0 00-.364 1.118l1.2 3.674c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.127 2.27c-.784.57-1.838-.197-1.539-1.118l1.2-3.674a1 1 0 00-.364-1.118L3.043 9.1c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.2-3.674z" />
            </svg>
        ));
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4">
                            <div className="flex justify-between mb-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-6 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Yet</h2>
                <p className="text-gray-600 mb-4">Be the first to share your experience with this product!</p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                    Write First Review
                </button>
            </div>
        );
    }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <div className="text-4xl font-bold text-gray-800">{stats.average}</div>
                            <div className="ml-2">
                                <div className="flex">{renderStars(Math.round(stats.average), 'w-5 h-5')}</div>
                                <div className="text-sm text-gray-500">Based on {stats.total} reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="mt-4 lg:mt-0 lg:ml-8">
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center gap-2 text-sm mb-1">
                            <span className="w-8 text-gray-600">{rating} ★</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${stats.distribution[5 - rating - 1] || 0}%` }}
                                ></div>
                            </div>
                            <span className="w-8 text-gray-500 text-right">
                                {stats.distribution[5 - rating - 1] ? Math.round(stats.distribution[5 - rating - 1]) : 0}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:border-blue-100"
                    >
                        {/* Header with user info and rating */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {review.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                        {review.user?.name || "Anonymous User"}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Verified Purchase Badge */}
                            {review.isVerified && (
                                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>

                        {/* Review Content */}
                        <div className="mb-4">
                            <p className="text-gray-700 leading-relaxed text-lg">{review.comment}</p>
                        </div>

                        {/* Review Features */}
                        <div className="flex flex-wrap gap-2">
                            {review.isRecommended && (
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Recommends this product
                                </span>
                            )}
                            
                            {review.helpful && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    Helpful Review
                                </span>
                            )}
                        </div>

                        {/* Review Actions */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <div className="flex gap-4 text-sm text-gray-500">
                                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    Helpful ({review.helpfulCount || 0})
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Reply
                                </button>
                            </div>
                            
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300">
                                Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {reviews.length >= 5 && (
                <div className="text-center mt-8">
                    <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium">
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
  )
}

export default GetReview