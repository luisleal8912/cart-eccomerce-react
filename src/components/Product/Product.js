import { Card, Button, Col } from "react-bootstrap";
import { URL_LOCAL } from "../../utils/constants";
import "./Product.scss";

export default function Product(props) {
  const { product, addProductCard } = props;

  return (
    <Col xs={3} className="product">
      <Card>
        <Card.Img variant="top" src={`${URL_LOCAL}/${product.image}`} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.extraInfo}</Card.Text>
          <Card.Text>{product.price.toFixed(2)} € / Unidad</Card.Text>
          <Button onClick={() => addProductCard(product.id, product.name)}>
            Añadir al carrito
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
