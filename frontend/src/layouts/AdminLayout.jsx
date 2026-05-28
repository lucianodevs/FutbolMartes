import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from '@/components/Sidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { useAuth } from '@/hooks/useAuth';

const Shell = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.div`
  min-width: 0;
`;

const Page = styled.div`
  padding: 24px;
`;

const Backdrop = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  @media (max-width: 960px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
  }
`;

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Shell>
      <Sidebar open={menuOpen} onClose={closeMenu} onLogout={handleLogout} />
      <Content>
        <AdminTopbar onMenuClick={() => setMenuOpen((value) => !value)} />
        <Page>
          <Outlet />
        </Page>
      </Content>
      <Backdrop $open={menuOpen} onClick={closeMenu} />
    </Shell>
  );
}
