import React from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import UnProduit from './UnProduit';

const Produit = () => {
  return (
    <div>
      <Navigation />
      <div className="container my-4 p-0">
        <UnProduit />
      </div>

      <Footer/>
    </div>
  );
};

export default Produit;