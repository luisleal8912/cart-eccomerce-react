import { Spinner } from "react-bootstrap";

import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <Spinner animation="border" role="status" />
      <h5>cargando...</h5>
    </div>
  );
}
