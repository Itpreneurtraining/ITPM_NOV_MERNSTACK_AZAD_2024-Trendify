


import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const currency = "₹";
  const delivery_fee = 40;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Load cart items from localStorage when the component mounts
    try {
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      if (storedCartItems) {
        setCartItems(storedCartItems);
      }
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    toast.success("Item added to the cart");

    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setCartItems(cartData);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (total, item) =>
        total + Object.values(item).reduce((subTotal, count) => subTotal + count, 0),
      0
    );
  };

  const updateQuantity = (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
      toast.success("Item removed from the cart");
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  };

  const getCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) return total;

      const itemTotal = Object.keys(cartItems[itemId]).reduce(
        (subTotal, size) => subTotal + itemInfo.price * cartItems[itemId][size],
        0
      );

      return total + itemTotal;
    }, 0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    // Restore token from localStorage if available
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
