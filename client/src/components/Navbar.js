// client/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import '../App.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm(''); 
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="site-header">
      <Link className="logo" to={user ? (user.role === 'admin' ? "/admin/orders" : "/products") : "/"}>
        HostelMart
      </Link>
      
      <nav className="main-nav">
        <ul>
          {/* --- ADMIN LINKS --- */}
          {user && user.role === 'admin' && (
            <>
              <li><span className="user-greeting">Hi, Admin {user.name}</span></li>
              <li><Link to="/admin/orders">Orders</Link></li>
              <li><Link to="/admin/products">Products</Link></li>
              <li><Link to="/admin/users">Customers</Link></li>
              <li><Link to="/admin/announce">Announce</Link></li> {/* 👈 NEW LINK */}
              <li>
                <button onClick={logout} className="btn small-btn logout-btn">
                  Log Out
                </button>
              </li>
            </>
          )}

          {/* --- USER LINKS (Unchanged) --- */}
          {user && user.role === 'user' && (
            <>
              <li>
                <form onSubmit={handleSearchSubmit} className="nav-search-form">
                  <input
                    type="search"
                    className="nav-search-input"
                    placeholder="Search snacks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn-search">🔍</button>
                </form>
              </li>
              <li>
                <Link to="/cart" className="cart-link">
                  🛒 Cart ({getCartCount()})
                </Link>
              </li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/addresses">Addresses</Link></li>
              <li><Link to="/help">Help/FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li>
                <button onClick={logout} className="btn small-btn logout-btn">
                  Log Out
                </button>
              </li>
            </>
          )}

          {/* --- LOGGED OUT LINKS (Unchanged) --- */}
          {!user && (
            <>
              <li><Link to="/help">Help/FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;