import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';

function Payment({product, quantity}) {
    const {user} = useContext(AuthContext);
    const [address, setAddress] = useState({
        address: "",
        city: "",
        postalCode: "",
        state: "",
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setAddress({...address, [e.target.name]: e.target.value});
    };

    const handlePayment = async () => {
        try {
            if (!product) {
                alert("Product details not found");
                return;
            }

            // basic form validation
            if (!address.address || !address.city || !address.postalCode ||!address.state) {
                alert("Please fill all shipping fields");
            }
            setLoading (true);

            const orderData = {
                items: [
                    {
                        name: product.name,
                        quantity: quantity || 1,
                        price: product.price,
                        image: product.image || product.images?.[0]?.url,
                        product: product._id,
                    },
                ],
                shippingAddress: address,
                itemsPrice: product.price * (quantity),
                taxPrice: 15,
                shippingPrice: 10,
                totalAmount: product.price * (quantity ||1) +25,
                currency: "INR",
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            // Create Razorpay order
            const {data} = await axios.post("/api/payments/create-order",
            orderData,
            config
            );

            // Razorpay payment options
            const options = {
                key: data.razorpayOrder.key,
                amount: data.razorpayOrder.amount,
                currency: data.razorpayOrder.currency,
                name: "Shop my side",
                description: `${product.name}`,
                order_id: data.razorpayOrder.id,
                handler: async function (response) {
                    // razorpay returns success data
                    const verifyRes = await axios.post('/api/payments/v', {
                        orderId: order._id,
                    },
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                    }
                );
                alert("✅ Payment successful!")
                },
                prefill: {
                    name: user.name,
                    email: user.email ,
                    contact: "9990009990",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Error creating order or opening Razorpay!");
        } finally{
            setLoading(false);
        }
    };


  return (
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>

      {/* Product Info */}
      {product && (
        <div className="mb-4 border-b pb-3">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-gray-600">Price: ₹{product.price}</p>
          <p>Quantity: {product.quantity || 1}</p>
          <p className="font-medium text-blue-600">
            Total: ₹{product.price * (product.quantity || 1) + 5}
          </p>
        </div>
      )}

      {/* Shipping Address Form */}
      <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={address.address}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={address.city}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={address.postalCode}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />
      <input
        type="text"
        name="state"
        placeholder="state"
        value={address.state}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  )
}

export default Payment