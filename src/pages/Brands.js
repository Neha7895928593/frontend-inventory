// src/context/BrandContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/brands', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`
          }
        });
        setBrands(response.data);
      } catch (err) {
        setError('Error fetching brands');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider value={{ brands, loading, error }}>
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContext;
