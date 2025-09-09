import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Fetch addresses
  const loadAddresses = async () => {
    try {
      const res = await axios.get("https://naturenest-y4n0.onrender.com/api/address", {
        withCredentials: true,
      });
      setAddresses(res.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // GPS Autofill
  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get(
            `https://naturenest-y4n0.onrender.com/api/location/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
            { withCredentials: true }
          );
          const address = res.data.address || {};
          setForm((prev) => ({
            ...prev,
            street:
              address.road ||
              address.residential ||
              address.quarter ||
              address.locality ||
              address.suburb ||
              "",
            city:
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              "",
            state: address.state || "",
            zip: address.postcode || "",
          }));
        } catch (err) {
          console.error(err);
          alert("Failed to fetch address from GPS");
        }
      },
      () => alert("Failed to get location. Allow GPS access.")
    );
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editId)
        await axios.put(`https://naturenest-y4n0.onrender.com/api/address/${editId}`, payload, {
          withCredentials: true,
        });
      else
        await axios.post("https://naturenest-y4n0.onrender.com/api/address", payload, {
          withCredentials: true,
        });

      setForm({ name: "", phone: "", street: "", city: "", state: "", zip: "" });
      setEditId(null);
      loadAddresses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save address");
    }
  };

  const handleEdit = (addr) => {
    setForm({ ...addr });
    setEditId(addr._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`http://localhost:5080/api/address/${id}`, {
        withCredentials: true,
      });
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading)
    return <p className="mt-20 text-center text-gray-600 animate-pulse">Loading...</p>;
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl p-4 mx-auto font-sans">
      {/* Top Nav */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 w-max"
        >
          <FaHome /> Home
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-center text-green-700 sm:text-3xl">
        My Addresses
      </h1>

      {/* Address Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 p-4 mb-8 bg-white rounded-lg shadow-md sm:grid-cols-2"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 border rounded focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Street"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="col-span-2 p-2 border rounded focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="p-2 border rounded focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="p-2 border rounded focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="PIN Code"
          value={form.zip}
          onChange={(e) => setForm({ ...form, zip: e.target.value })}
          className="p-2 border rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="col-span-1 p-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Add"} Address
        </button>
        <button
          type="button"
          onClick={handleUseLocation}
          className="col-span-1 p-3 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Use My Location
        </button>
      </form>

      {/* Address List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addresses.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">No addresses yet.</p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md"
          >
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">Name:</p>
              <p>{addr.name}</p>
              <p className="font-semibold">Phone:</p>
              <p>{addr.phone}</p>
              <p className="font-semibold">Street:</p>
              <p>{addr.street}</p>
              <p className="font-semibold">City:</p>
              <p>{addr.city}</p>
              <p className="font-semibold">State:</p>
              <p>{addr.state}</p>
              <p className="font-semibold">PIN:</p>
              <p>{addr.zip}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(addr)}
                className="flex-1 p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="flex-1 p-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
