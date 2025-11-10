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
            
        } catch (error) {
            
        }
    }
  return (
    <div>ProductCreate</div>
  )
}

export default ProductCreate