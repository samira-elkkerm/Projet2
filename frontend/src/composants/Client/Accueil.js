import React, { useEffect, useState } from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import Slider from '../../layout/slider';
import BarreCategories from './BarreCategories';
import ListProduits from './ListProduits';

const Accueil = () => {

  return (
    <div>
         <Navigation />
         <Slider/>
         <BarreCategories/>
         <ListProduits/>
          <Footer/>

    </div>
  );
};

export default Accueil;
