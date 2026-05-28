import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

const Main = styled.main`
  padding-bottom: 24px;
`;

export function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Main>
        <Outlet />
      </Main>
      <PublicFooter />
    </>
  );
}
