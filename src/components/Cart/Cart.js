import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ReactComponent as CartEmpty } from "../../assets/svg/cart-empty.svg";
import { ReactComponent as CartFull } from "../../assets/svg/cart-full.svg";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import { ReactComponent as Garbage } from "../../assets/svg/garbage.svg";
import { KEY_PRODUCT_CARD } from "../../utils/constants";
import {
  removeArrayDuplicates,
  countduplicateitemArray,
  removeItemArray,
} from "../../utils/arrayFunc";
import { URL_LOCAL } from "../../utils/constants";

import "./Cart.scss";

export default function Cart(props) {
  const { productsCard, getProductsCard, products } = props;
  const [cartOpen, setCartOpen] = useState(false);
  const widthCartContent = cartOpen ? 400 : 0;
  const [singelProductsCart, setSingelProductsCart] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);

  useEffect(() => {
    const allProductsId = removeArrayDuplicates(productsCard);
    setSingelProductsCart(allProductsId);
  }, [productsCard]);

  useEffect(() => {
    const productData = [];
    let totalPrice = 0;

    const allProductsId = removeArrayDuplicates(productsCard);
    allProductsId.forEach((productId) => {
      const quantity = countduplicateitemArray(productId, productsCard);
      const productValue = {
        id: productId,
        quantity: quantity,
      };
      productData.push(productValue);
    });

    if (!products.loading && products.result) {
      products.result.forEach((product) => {
        productData.forEach((item) => {
          if (product.id == item.id) {
            const totalValue = product.price * item.quantity;
            totalPrice = totalPrice + totalValue;
          }
        });
      });
    }
    setCartTotalPrice(totalPrice);
  }, [productsCard, products]);

  const openCart = () => {
    setCartOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    setCartOpen(false);
    document.body.style.overflow = "scroll";
  };

  const emptyCart = () => {
    localStorage.removeItem(KEY_PRODUCT_CARD);
    getProductsCard();
  };

  const increaseQuantity = (id) => {
    const arrayItemsCart = productsCard;
    arrayItemsCart.push(id);
    localStorage.setItem(KEY_PRODUCT_CARD, arrayItemsCart);
    getProductsCard();
  };

  const decreaseQuantity = (id) => {
    const arrayItemsCart = productsCard;
    const result = removeItemArray(arrayItemsCart, id.toString());
    localStorage.setItem(KEY_PRODUCT_CARD, result);
    getProductsCard();
  };

  return (
    <>
      <Button variant="link" className="cart">
        {productsCard.length > 0 ? (
          <CartFull onClick={openCart} />
        ) : (
          <CartEmpty onClick={openCart} />
        )}
      </Button>
      <div className="cart-content" style={{ width: widthCartContent }}>
        <CartContentHeader closeCart={closeCart} emptyCart={emptyCart} />
        <div className="cart-content__products">
          {singelProductsCart.map((idProdcutsCart, index) => (
            <CartContentBody
              key={index}
              products={products}
              idsProdcutsCart={productsCard}
              idProdcutsCart={idProdcutsCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          ))}
        </div>
        <CardConterFooter cartTotalPrice={cartTotalPrice} />
      </div>
    </>
  );
}

function CartContentHeader(props) {
  const { closeCart, emptyCart } = props;
  return (
    <div className="cart-content__header">
      <div>
        <Close onClick={closeCart} />
        <h2>Carrito</h2>
      </div>
      <Button variant="link">
        Vaciar
        <Garbage onClick={emptyCart} />
      </Button>
    </div>
  );
}

function CartContentBody(props) {
  const {
    products: { loading, result },
    idsProdcutsCart,
    idProdcutsCart,
    increaseQuantity,
    decreaseQuantity,
  } = props;

  if (!loading && result) {
    return result.map((product, index) => {
      if (idProdcutsCart == product.id) {
        const quantity = countduplicateitemArray(product.id, idsProdcutsCart);
        return (
          <RenderProduct
            key={index}
            product={product}
            quantity={quantity}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
        );
      }
    });
  }
  return null;
}

function RenderProduct(props) {
  const { product, quantity, increaseQuantity, decreaseQuantity } = props;
  return (
    <div className="cart-content__product">
      <img src={`${URL_LOCAL}/${product.image}`} alt={product.name} />
      <div className="cart-content__product-info">
        <div>
          <h3>{product.name.substr(0, 25)}...</h3>
          <p>{product.price.toFixed(2)} € / Unidad </p>
        </div>
        <div>
          <p>En carro: {quantity} ud.</p>
          <div>
            <button onClick={() => increaseQuantity(product.id)}>+</button>
            <button onClick={() => decreaseQuantity(product.id)}>-</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardConterFooter(props) {
  const { cartTotalPrice } = props;

  return (
    <div className="cart-content__footer">
      <div>
        <p>Total aproximado: </p>
        <p>{cartTotalPrice.toFixed(2)} €</p>
      </div>
      <Button>Tramitar pedido</Button>
    </div>
  );
}
