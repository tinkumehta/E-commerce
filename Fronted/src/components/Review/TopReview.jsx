import axios from 'axios';
import React, { useEffect , useState} from 'react'

function TopReview() {
    const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get('/api/reviews/top-rated', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setTopProducts(res.data);
        } catch (error) {
            setError("Failed to load top-rated products.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

   if (loading) return <p className="text-gray-500">Loading top-rated products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 mt-6'>
      <h2 className='text-xl font-black text-gray-800 mb-4'>
        ⭐ Top Rated Products
      </h2>
     {topProducts.length === 0 ? (
        <p className="text-gray-500">No top-rated products found.</p>
     ): (
        <ul className='space-y-3'>
            {topProducts.map((product, index) => (
                <li
                 key={index}
                 className='flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
                 >
                    <span className="font-medium">{product.name}</span>
              <span className="text-yellow-500 font-bold">
                ⭐ {product.averageRating}
              </span> 
                 </li>
            ))}
        </ul>
     )}
        </div>
  );
}

export default TopReview