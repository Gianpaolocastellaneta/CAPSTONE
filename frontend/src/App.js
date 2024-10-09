import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import NavigationBar from './components/navbar/Navbar';
import Home from './components/home/Home';
import ProductDetail from './components/product/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Products from './pages/Product';
import EditProduct from './pages/EditProduct';
import NewProduct from './pages/NewProduct';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import Footer from './components/footer/footer';


function App() {
  return (
    <AuthProvider>
    <Router>
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/add" element={<NewProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google-callback" element={<GoogleAuthCallback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  </Router>
  </AuthProvider>
);
}

export default App;
