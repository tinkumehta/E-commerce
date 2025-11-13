// src/services/productService.js
import axios from "axios";

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`/api/products?${query}`);
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data;
};


export  const deleteProduct = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ from AuthContext/localStorage
      },
    });

    if (!res.ok) throw new Error("Failed to delete product");
    const data = await res.json();

    alert(data.message || "Product deleted successfully");
    // Refresh products after deletion
    fetchProducts();
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Error deleting product. Please try again.");
  }
};