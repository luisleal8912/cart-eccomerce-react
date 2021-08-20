import { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import TopMenu from "./components/TopMenu";
import { urlApiProducts } from "./utils/constants";
import Products from "./components/Products";
import { KEY_PRODUCT_CARD } from "./utils/constants";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const result = useFetch(urlApiProducts, null);
  const [productsCard, setProductsCard] = useState([]);

  const addProductCard = (id, name) => {
    const productsId = productsCard;
    productsId.push(id);
    setProductsCard(productsId);
    localStorage.setItem(KEY_PRODUCT_CARD, productsCard);
    getProductsCard();
    toast.success(`${name} añadido al carrito correctamente.`);
  };

  useEffect(() => {
    getProductsCard();
  }, []);

  const getProductsCard = () => {
    setProductsCard(
      localStorage.getItem(KEY_PRODUCT_CARD)
        ? localStorage.getItem(KEY_PRODUCT_CARD).split(",")
        : []
    );
  };

  return (
    <div>
      <TopMenu
        products={result}
        productsCard={productsCard}
        getProductsCard={getProductsCard}
      />
      <Products products={result} addProductCard={addProductCard} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover={false}
        draggable
      />
    </div>
  );
}

export default App;
