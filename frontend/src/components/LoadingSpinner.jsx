import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
`;

const Ring = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.9s linear infinite;
`;

export function LoadingSpinner() {
  return (
    <Wrapper>
      <Ring />
    </Wrapper>
  );
}
