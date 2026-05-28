import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiHome } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  background: rgba(7, 17, 31, 0.84);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button`
  display: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 12px;
  border-radius: 12px;

  @media (max-width: 960px) {
    display: inline-flex;
  }
`;

const User = styled.div`
  color: ${({ theme }) => theme.colors.muted};
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

export function AdminTopbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <Bar>
      <Button onClick={onMenuClick} aria-label="Abrir menú"><FiMenu /></Button>
      <User>Bienvenido, {user?.nombre || 'Admin'}</User>
      <HomeLink to="/"><FiHome /> Ir a la landing</HomeLink>
    </Bar>
  );
}
