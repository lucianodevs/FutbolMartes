import styled from 'styled-components';
import { FiActivity, FiAward, FiClock, FiTarget, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { formatNumber } from '@/utils/formatters';

const Grid = styled.section`
  width: min(1200px, calc(100% - 32px));
  margin: 30px auto;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 18px;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.div`
  margin-top: 10px;
  font-size: 1.7rem;
  font-weight: 700;
`;

const icons = [FiActivity, FiAward, FiClock, FiTarget, FiTrendingUp, FiAlertTriangle];

export function OverviewStats({ stats }) {
  const cards = [
    { label: 'Jugadores', value: stats?.totalJugadores ?? 0 },
    { label: 'Goles', value: formatNumber(stats?.totalGoles ?? 0) },
    { label: 'Presencias', value: formatNumber(stats?.totalPresencias ?? 0) },
    { label: 'Sanciones', value: formatNumber(stats?.totalSanciones ?? 0) },
    { label: 'Victorias Dictadores', value: formatNumber(stats?.victoriasDictadores ?? 0) },
    { label: 'Victorias Tramposos', value: formatNumber(stats?.victoriasTramposos ?? 0) },
  ];

  return (
    <Grid>
      {cards.map((card, index) => {
        const Icon = icons[index];
        return (
          <Card key={card.label}>
            <Label><Icon /> {card.label}</Label>
            <Value>{card.value}</Value>
          </Card>
        );
      })}
    </Grid>
  );
}
