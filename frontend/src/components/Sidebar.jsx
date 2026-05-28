import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiUsers, FiCalendar, FiLogOut, FiShield } from 'react-icons/fi';

const Panel = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 280px;
  padding: 24px;
  background: rgba(9, 18, 31, 0.96);
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 960px) {
    position: fixed;
    inset: 0 auto 0 0;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.25s ease;
    z-index: 40;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

const Menu = styled.nav`
  display: grid;
  gap: 10px;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Logout = styled.button`
  margin-top: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
`;

export function Sidebar({ onLogout, open, onClose }) {
  return (
    <Panel $open={open}>
      <Brand to="/" onClick={onClose}><FiShield /> Futbol Stats</Brand>
      <Menu>
        <Item to="/dashboard" end onClick={onClose}><FiHome /> Overview</Item>
        <Item to="/dashboard/players" onClick={onClose}><FiUsers /> Jugadores</Item>
        <Item to="/dashboard/matches" onClick={onClose}><FiCalendar /> Partidos</Item>
      </Menu>
      <Logout onClick={onLogout}><FiLogOut /> Cerrar sesión</Logout>
    </Panel>
  );
}
