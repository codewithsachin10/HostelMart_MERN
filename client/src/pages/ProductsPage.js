// src/pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../App.css'; 

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // FIX: Ensure the API endpoint is correctly targeted
        const response = await fetch(`http://localhost:5001/api/products?search=${keyword}`);
        const data = await response.json();
        
        // Check if the response is valid JSON (not an HTML error page)
        if (!response.ok) {
           console.error("Server responded with error or unexpected format.");
           throw new Error(data.message || "Could not fetch products. Check server.");
        }

        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, [keyword]); // Re-run this effect when the keyword changes

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <main className="container products-page">
      <h2 className="section-title">
        {keyword ? `Results for "${keyword}"` : 'Available Products'}
      </h2>
      
      <div className="grid" id="products-grid">
        {products.length === 0 && <p>No products found.</p>}
        
        {products.map((product) => (
          <div key={product._id} className="card product">
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            
            {product.countInStock > 0 ? (
              <button 
                className="btn" 
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart ({product.countInStock} left)
              </button>
            ) : (
              <button className="btn muted-btn" disabled>
                Out of Stock
              </button>
            )}

          </div>
        ))}
      </div>
      
      <footer className="site-footer">
        <small>© 2025 HostelMart</small>
      </footer>
    </main>
  );
}

export default ProductsPage;