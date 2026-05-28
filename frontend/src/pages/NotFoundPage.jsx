import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px;
`;

export function NotFoundPage() {
  return (
    <Wrap>
      <div>
        <h1>404</h1>
        <p>Página no encontrada</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    </Wrap>
  );
}
