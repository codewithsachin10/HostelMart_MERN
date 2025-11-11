// client/src/pages/AdminProductsPage.js
import React, { useState, useEffect } from 'react';
import '../App.css';


function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', countInStock: '' });
  const [editingId, setEditingId] = useState(null); 
  const token = localStorage.getItem('token');

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setMessage(''); 
    try {
      // FIX: Ensure the API endpoint is correctly targeted
      const response = await fetch(`http://localhost:5001/api/products`); 
      const data = await response.json(); 

      if (!response.ok) {
        // This handles the error if the product list is empty
        throw new Error(data.message || `HTTP error! Status: ${response.status}`); 
      }

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setMessage(`Error fetching products: ${error.message}`); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clear form and reset to "Add" mode
  const resetForm = () => {
    setFormData({ name: '', price: '', countInStock: '' });
    setEditingId(null);
    setMessage('');
  };

  // Set form to "Edit" mode
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      countInStock: product.countInStock,
    });
    setMessage('');
    window.scrollTo(0, 0); 
  };

  // Handle Add/Update submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    const url = editingId
      ? `http://localhost:5001/api/admin/products/${editingId}`
      : `http://localhost:5001/api/admin/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.message || `Failed to save product. Status: ${response.status}`);
      }
      
      setMessage(`Product ${editingId ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/admin/products/${productId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      setMessage('Product deleted!');
      fetchProducts(); // Refresh the list
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="container admin-page">
      <div className="address-layout">
        {/* --- Left Side: Product List --- */}
        <div className="admin-section">
          <h1 className="section-title">Manage Products</h1>
          {loading && <p>Loading products...</p>}
          <div className="customer-list">
            {products.map((product) => (
              <div key={product._id} className="card product-card">
                <h4>{product.name}</h4>
                <p>Price: ₹{product.price}</p>
                <p>Stock: {product.countInStock}</p>
                <div className="address-actions">
                  <button onClick={() => handleEditClick(product)} className="btn small-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="btn small-btn muted-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Side: Add/Edit Form --- */}
        <div className="admin-section">
          <div className="card product cart-panel">
            <h3>{editingId ? 'Update Product' : 'Add New Product'}</h3>
            <form className="checkout-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required aria-required="true" />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleFormChange} required aria-required="true" />
              </div>
              <div className="form-group">
                <label htmlFor="countInStock">Count in Stock</label>
                <input type="number" id="countInStock" name="countInStock" value={formData.countInStock} onChange={handleFormChange} required aria-required="true" />
              </div>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" className="btn muted-btn" onClick={resetForm} style={{marginTop: '10px'}}>
                  Cancel Edit
                </button>
              )}
              {/* Display message based on state */}
              {message && <p className={`success-msg ${message.includes('Error') || message.includes('failed') ? 'error-msg' : ''}`} style={{marginTop: '10px'}}>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminProductsPage;
