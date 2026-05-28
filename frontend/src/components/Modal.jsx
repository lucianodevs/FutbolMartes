import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(3, 8, 14, 0.72);
  backdrop-filter: blur(12px);
  padding: 20px;
`;

const Box = styled.div`
  width: min(920px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Body = styled.div`
  padding: 22px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Close = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 26px;
  cursor: pointer;
`;

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Box onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <Close onClick={onClose} aria-label="Cerrar modal">×</Close>
        </Header>
        <Body>{children}</Body>
      </Box>
    </Overlay>
  );
}
