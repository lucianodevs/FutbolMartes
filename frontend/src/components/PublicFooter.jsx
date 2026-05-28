import styled from 'styled-components';

const Footer = styled.footer`
  width: min(1200px, calc(100% - 32px));
  margin: 56px auto 24px;
  padding: 22px 0 0;
  color: ${({ theme }) => theme.colors.muted};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export function PublicFooter() {
  return <Footer>Futbol Stats Pro · Panel deportivo moderno para administración amateur.</Footer>;
}
