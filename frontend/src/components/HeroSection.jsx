import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiZap } from 'react-icons/fi';
import { formatNumber } from '@/utils/formatters';

const Hero = styled.section`
  width: min(1200px, calc(100% - 32px));
  margin: 34px auto 0;
  display: grid;
  gap: 24px;
  grid-template-columns: 1.15fr 0.85fr;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: linear-gradient(180deg, rgba(18,35,59,0.88), rgba(7,17,31,0.92));
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 34px;
  position: relative;
  overflow: hidden;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 16px 0 12px;
  font-size: clamp(2.3rem, 5vw, 4.7rem);
  line-height: 0.98;
`;

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.02rem;
  max-width: 62ch;
`;

const Metrics = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
`;

const Metric = styled.div`
  padding: 18px;
  border-radius: 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
`;

const MetricValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 10px;
`;

const Side = styled(motion.div)`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  padding: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px;
`;

const RankingList = styled.ol`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
`;

const RankingItem = styled.li`
  color: ${({ theme }) => theme.colors.text};

  small {
    display: block;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

function RankingCard({ title, items, detailBuilder }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {!items?.length ? (
        <div>Sin datos</div>
      ) : (
        <RankingList>
          {items.slice(0, 3).map((item) => (
            <RankingItem key={`${title}-${item.id}`}>
              {item.nombre} {item.apellido}
              <small>{detailBuilder(item)}</small>
            </RankingItem>
          ))}
        </RankingList>
      )}
    </Card>
  );
}

export function HeroSection({ overview }) {
  const topScorers = overview?.topScorers || (overview?.topScorer ? [overview.topScorer] : []);
  const topPresences = overview?.topPresences || (overview?.mostPresences ? [overview.mostPresences] : []);
  const topSanctions = overview?.topSanctions || (overview?.mostSanctions ? [overview.mostSanctions] : []);
  const topMvps = overview?.topMvps || [];

  return (
    <Hero>
      <Panel>
        <Badge><FiZap /> Estadísticas en vivo</Badge>
        <Title>Administra el fútbol amateur con una experiencia premium.</Title>
        <Text>
          Seguimiento de jugadores, partidos, victorias y asistencia con un tablero moderno, rápido y preparado para crecer.
        </Text>
        <Metrics>
          <Metric>
            <FiUsers />
            <MetricValue>{overview?.totalJugadores ?? 0}</MetricValue>
            <small>Jugadores registrados</small>
          </Metric>
          <Metric>
            <FiBarChart2 />
            <MetricValue>{overview?.totalPartidos ?? 0}</MetricValue>
            <small>Partidos disputados</small>
          </Metric>
        </Metrics>
      </Panel>
      <Side initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <RankingCard
          title="Top goleadores"
          items={topScorers}
          detailBuilder={(item) => `${formatNumber(item.goles)} goles`}
        />
        <RankingCard
          title="Más presencias"
          items={topPresences}
          detailBuilder={(item) => `${formatNumber(item.presencias)} presencias • ${item.asistencia_porcentaje ?? 0}%`}
        />
        <RankingCard
          title="Más sanciones"
          items={topSanctions}
          detailBuilder={(item) => `${formatNumber(item.sanciones)} sanciones`}
        />
        <RankingCard
          title="Top MVP"
          items={topMvps}
          detailBuilder={(item) => `${formatNumber(item.mvp_count)} MVP`}
        />
      </Side>
    </Hero>
  );
}
