import React from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import Slider from '../../layout/slider';
import BarreCategories from './BarreCategories';

const Accueil = () => {

  return (
    <div>
         <Navigation />
         <Slider/>
         <BarreCategories/>

      
      


        <Footer/>

    </div>
  );
};

export default Accueil;
