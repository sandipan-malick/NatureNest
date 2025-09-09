import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaHome, FaHistory, FaShoppingCart, FaListUl } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://naturenest-y4n0.onrender.com/api/product", {
          withCredentials: true,
        });
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);

        const initialQuantities = {};
        (res.data || []).forEach((p) => (initialQuantities[p._id] = 1));
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (minRating > 0) filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    if (maxPrice > 0) filtered = filtered.filter((p) => (p.price || 0) <= maxPrice);
    if (category.trim() !== "")
      filtered = filtered.filter((p) =>
        p.category?.toLowerCase().includes(category.toLowerCase())
      );
    setFilteredProducts(filtered);
  }, [minRating, maxPrice, category, products]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, value) }));
  };

  const handleAddToCart = async (id) => {
    try {
      const quantity = quantities[id] || 1;
      await axios.post(
        "https://naturenest-y4n0.onrender.com/api/cart/product-booking",
        { productId: id, quantity },
        { withCredentials: true }
      );
      alert(`✅ Added ${quantity} item(s) to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  if (loading)
    return <p className="mt-20 text-center text-gray-600 animate-pulse">Loading products...</p>;
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-green-50">
      {/* Filters Section */}
      <div className="flex flex-wrap justify-center gap-6 p-4 mb-8 bg-white shadow-md rounded-xl">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>
                {val === 0 ? "Any" : val + "★"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Max Price (₹)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Dress, Food"
            className="w-48 p-2 border rounded"
          />
        </div>
      </div>

      {/* Page Title */}
      <h1 className="mb-8 text-4xl font-bold text-center text-green-800">Explore All Products</h1>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No products found.</p>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300"
            >
              <img
                src={p.image || "https://via.placeholder.com/400x250"}
                alt={p.name}
                className="object-cover w-full h-56"
              />
              <div className="flex flex-col flex-1 p-4">
                <h2 className="mb-1 text-xl font-semibold text-green-900">{p.name}</h2>
                <p className="mb-2 text-sm text-gray-500">{p.category}</p>
                <p className="flex-1 mb-2 text-gray-600">{p.description}</p>
                <div className="flex items-center mb-2 font-semibold text-yellow-500">
                  <FaStar className="mr-1" /> {p.rating || "N/A"}
                </div>
                <p className="mb-2 text-lg font-bold text-green-700">₹{p.price}</p>
                <p className="mb-2 text-sm text-gray-500">Stock: {p.stock || 0}</p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mb-3">
                  <label className="font-semibold">Qty:</label>
                  <input
                    type="number"
                    min={1}
                    max={p.stock || 10}
                    value={quantities[p._id] || 1}
                    onChange={(e) => handleQuantityChange(p._id, Number(e.target.value))}
                    className="w-16 p-1 text-center border rounded"
                  />
                </div>

                <button
                  onClick={() => handleAddToCart(p._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition transform hover:scale-[1.03]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-800 shadow-inner md:hidden">
        <div className="flex justify-around py-2">
          <Link className="flex flex-col items-center text-white hover:text-green-300" to="/">
            <FaHome size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <Link className="flex flex-col items-center text-white hover:text-yellow-300" to="/product-history">
            <FaHistory size={20} />
            <span className="text-xs">History</span>
          </Link>
          <Link className="flex flex-col items-center text-white hover:text-blue-300" to="/product-cart">
            <FaShoppingCart size={20} />
            <span className="text-xs">Cart</span>
          </Link>
          <Link className="flex flex-col items-center text-white hover:text-purple-300" to="/all-product">
            <FaListUl size={20} />
            <span className="text-xs">Products</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
