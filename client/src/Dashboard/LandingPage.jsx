import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaListUl, FaMapMarkerAlt, FaEnvelope, FaSignOutAlt, FaUser, FaChevronDown } from "react-icons/fa";
import api from "../utils/axios";

const texts = {
  en: {
    heroTitle: "Welcome to Nature Nest",
    heroSubtitle: "Discover serene retreats, wildlife adventures, and sustainable experiences",
    contactNumber: "6290975880",
    languageSwitch: "EN / BN",
    logoutBtn: "Logout",
    addressBtn: "My Addresses",
    customerBtn: "Customers",
    productDropdown: "Products",
    cart: "Cart",
    history: "History",
  },
  bn: {
    heroTitle: "নেচার নেস্ট-এ স্বাগতম",
    heroSubtitle: "শান্তিপূর্ণ অবকাশ, বন্যপ্রাণী অভিযান এবং টেকসই অভিজ্ঞতা আবিষ্কার করুন",
    contactNumber: "7364853753",
    languageSwitch: "BN / EN",
    logoutBtn: "লগআউট",
    addressBtn: "আমার ঠিকানাসমূহ",
    customerBtn: "গ্রাহক",
    productDropdown: "পণ্য",
    cart: "কার্ট",
    history: "ইতিহাস",
  },
};

export default function LandingPage() {
  const [language, setLanguage] = useState("en");
  const [showContact, setShowContact] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const t = texts[language];
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await api.get("/");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("https://naturenest-y4n0.onrender.com/api/user/logout", {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-green-50 via-green-100 to-green-200">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-800">Nature Nest</h1>

        <div className="flex items-center gap-2">
          {/* Desktop Nav */}
          <nav className="relative items-center hidden gap-4 font-semibold text-green-900 md:flex">
            <Link to="/" className="flex items-center gap-1 hover:text-green-700">
              <FaHome /> Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative" onMouseEnter={() => setProductDropdownOpen(true)} onMouseLeave={() => setProductDropdownOpen(false)}>
              <button className="flex items-center gap-1 hover:text-green-700">
                <FaListUl /> {t.productDropdown} <FaChevronDown className="ml-1 text-xs"/>
              </button>

              {productDropdownOpen && (
                <div className="absolute left-0 z-50 w-40 mt-2 bg-white border rounded-lg shadow-lg">
                  <Link
                    to="/product-cart"
                    className="block px-4 py-2 text-green-900 hover:bg-green-50"
                  >
                    {t.cart}
                  </Link>
                  <Link
                    to="/product-history"
                    className="block px-4 py-2 text-green-900 hover:bg-green-50"
                  >
                    {t.history}
                  </Link>
                </div>
              )}
            </div>

            <Link to="/address" className="flex items-center gap-1 hover:text-green-700">
              <FaMapMarkerAlt /> {t.addressBtn}
            </Link>

            <button onClick={() => setShowContact(!showContact)} className="flex items-center gap-1 hover:text-green-700">
              <FaUser /> {t.customerBtn}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
            >
              <FaSignOutAlt /> {t.logoutBtn}
            </button>

            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-2 py-1 border border-green-700 rounded hover:bg-green-700 hover:text-white"
            >
              {t.languageSwitch}
            </button>
          </nav>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-white bg-red-600 rounded md:hidden hover:bg-red-700"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center h-[80vh] text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
          alt="Nature Nest Hero"
          className="absolute inset-0 object-cover w-full h-full brightness-75"
        />
        <div className="relative z-10 px-6 text-white">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{t.heroTitle}</h1>
          <p className="text-lg sm:text-2xl">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed z-50 p-6 text-green-900 transform -translate-x-1/2 bg-white shadow-2xl top-1/4 left-1/2 rounded-xl w-72">
          <h2 className="mb-2 text-lg font-bold">Contact Us</h2>
          <p className="mb-2">Phone: {t.contactNumber}</p>
          <p className="mb-4">Email: info@nature-nest.com</p>
          <button
            onClick={() => setShowContact(false)}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="p-6 mt-auto text-center text-white bg-green-800">
        <p>© 2025 Nature Nest Eco Tourism. All rights reserved.</p>
        <button
          onClick={() => setLanguage(language === "en" ? "bn" : "en")}
          className="mt-2 underline hover:text-green-300"
        >
          {t.languageSwitch}
        </button>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around p-2 text-white bg-green-800 shadow-inner md:hidden">
        <Link to="/" className="flex flex-col items-center text-sm">
          <FaHome className="mb-1 text-lg" /> Home
        </Link>
        <Link to="/all-product" className="flex flex-col items-center text-sm">
          <FaListUl className="mb-1 text-lg" /> Products
        </Link>
        <Link to="/address" className="flex flex-col items-center text-sm">
          <FaMapMarkerAlt className="mb-1 text-lg" /> Address
        </Link>
        <button onClick={() => setShowContact(!showContact)} className="flex flex-col items-center text-sm">
          <FaEnvelope className="mb-1 text-lg" /> Contact
        </button>
      </nav>
    </div>
  );
}
