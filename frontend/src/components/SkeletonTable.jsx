import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
`;

const Row = styled.div`
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.3s infinite;
`;

export function SkeletonTable({ rows = 5 }) {
  return <Grid>{Array.from({ length: rows }).map((_, index) => <Row key={index} />)}</Grid>;
}
