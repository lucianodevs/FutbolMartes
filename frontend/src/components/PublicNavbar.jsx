import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiShield, FiLogIn, FiGrid, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
  background: rgba(6, 16, 28, 0.84);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Action = styled(NavLink)`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  &.active {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: #06101c;
  padding: 11px 16px;
  border-radius: 14px;
  font-weight: 700;
`;

const GhostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <FiShield /> Futbol Martes Dictadores - Tramposos
        </Brand>
        <Nav>
          <Action to="/">Estadísticas</Action>
          {user ? (
            <>
              <GhostButton to="/dashboard"><FiGrid /> Dashboard</GhostButton>
              <Button as="button" onClick={handleLogout}><FiLogOut /> Salir</Button>
            </>
          ) : (
            <Button to="/login"><FiLogIn /> Admin</Button>
          )}
        </Nav>
      </Inner>
    </Bar>
  );
}
