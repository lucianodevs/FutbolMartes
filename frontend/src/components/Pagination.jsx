import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $primary }) => ($primary ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $primary }) => ($primary ? '#07111f' : theme.colors.text)};
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
`;

export function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <Wrap>
      <span>Página {page} de {totalPages || 1}</span>
      <Actions>
        <Button onClick={onPrev} disabled={page <= 1}>Anterior</Button>
        <Button onClick={onNext} disabled={page >= totalPages}>Siguiente</Button>
      </Actions>
    </Wrap>
  );
}
