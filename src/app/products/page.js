"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie library
import { useRouter } from "next/navigation"; // To handle redirection
import Navbar from "../../components/Navbar"; // Import Navbar
import Footer from "../../components/Footer"; // Import Footer
import AuthGuard from "@/components/AuthGuard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  // Fetch products from the API
  const fetchProducts = async () => {
    const token = Cookies.get("token"); // Retrieve token from cookies

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the JWT token
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products. Please log in again.");
      }

      const data = await res.json();
      setProducts(data); // Update the products state
    } catch (err) {
      setError(err.message); // Handle any errors
    }
  };

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `${BASE_URL}/products/${form._id}` : BASE_URL;

    const payload = { ...form };
    if (!form._id) delete payload._id;
    console.log("Submitting form");

    const token = Cookies.get("token"); // Retrieve token from cookies
    console.log(token, "Token retrieved from cookies");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to headers
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Unauthorized or failed to save product.");
      }

      await fetchProducts(); // Refresh product list
      setForm({ _id: "", name: "", price: "", description: "", category: "" }); // Reset form
      setError(""); // Clear errors
    } catch (err) {
      setError(err.message); // Handle any errors
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setForm({
      _id: product._id || "",
      name: product.name || "", // Ensure it is always a string
      price: product.price || "", // Ensure it is always a string
      description: product.description || "", // Ensure it is always a string
      category: product.category || "", // Ensure it is always a string
    });
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    console.log(token, "Token retrieved from cookies");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized or failed to delete product.");
      }
      setForm({
        _id: "",
        name: "",
        price: "",
        description: "",
        category: "",
      });

      await fetchProducts(); // Refresh product list after deletion
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message); // Handle any errors
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AuthGuard>
      <div>
        <Navbar /> {/* Include Navbar */}
        <div className="max-w-4xl mx-auto py-10">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 underline">
            Products
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-700">
                    {product.name}
                  </p>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
            {form._id ? "Edit Product" : "Add Product"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.name || ""} // Ensure fallback for empty form
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.price || ""} // Ensure fallback for empty form
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description || ""} // Ensure fallback for empty form
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.category || ""} // Ensure fallback for empty form
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              {form._id ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
        <Footer /> {/* Include Footer */}
      </div>
    </AuthGuard>
  );
};

export default Products;
