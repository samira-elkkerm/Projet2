import Footer from "../../layout/Footer";
import Navigation from "../../layout/Navigation";
import Slider from "../../layout/slider";
import BarreCategories from "./BarreCategories";
import ListProduits from "./ListProduits";
import DernierProduits from './DernierProduits';

const Accueil = () => {
  return (
    <div>
      <Navigation />
      <Slider />
      <div className="container my-4 p-0">
        <div className="content">
          <BarreCategories />
          <ListProduits />
        </div>
        <DernierProduits />
      </div>
      <Footer />
    </div>
  );
};

export default Accueil;
