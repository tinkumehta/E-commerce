import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

function ProductCreate() {
    const {user} = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        descriptions: "",
        price: "",
        category: "",
        stock: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const form = new FormData();
            Object.keys(formData).forEach((key) => form.append(key, formData[key]));
            images.forEach((img) => form.append("images", img));

            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Please login before creating a product.");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/products", {
                method: "POST",
                body: form,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to create product");
            const data = await res.json();

            setMessage("✅ Product created successfully!")
            setFormData({name: "", descriptions: "", price: "", category:"", stock:""});
            setImages([]);
          //  console.log("Created Product:", data)
            
        } catch (error) {
             console.error(error);
            setMessage("❌ Error creating product. Please try again.");
        } finally{
            setLoading(false);
        }
    };

    // Protect this page: Only allow logged-in users
    if (!user) {
        return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">
          🚫 You must be logged in to create a product.
        </p>
      </div>
    );
    }
  return (
    <div className="flex justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create New Product</h2>

        {message && <p className="mb-4 text-center text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
            <input
             name='name'
             placeholder='Product Name'
             value={formData.name}
             onChange={handleChange}
             className='border rounded p-2 w-full'
             required
            />
            <textarea 
             name='description'
             placeholder='Description'
             value={formData.descriptions}
             onChange={handleChange}
             className='border rounded p-2 w-full'
             required
            />
            <input 
             name='price'
             value={formData.price}
             onChange={handleChange}
             className='border rounded p-2 w-full'
             placeholder='Price'
             required
            />
            <input 
             name='category'
             placeholder='Category'
             value={formData.category}
             onChange={handleChange}
             className='border rounded p-2 w-full'
             required
            />
            <input 
             name='stock'
             placeholder='Stock'
             type='number'
             value={formData.stock}
             onChange={handleChange}
             className='border rounded p-2 w-full'
             required
            />
            <input 
             type="file" 
             multiple
             accept='image/*'
             onChange={handleImageChange}
             className='w-full'
            />
            <button
             type='submit'
             disabled={loading}
             className="bg-blue-600 text-white rounded p-2 w-full hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Creating.." : "Create Product"}
            </button>
        </form>
        </div>
        </div>
  );
}

export default ProductCreate