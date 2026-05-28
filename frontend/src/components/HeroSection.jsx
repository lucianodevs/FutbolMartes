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

export function HeroSection({ overview }) {
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
        <Card>
          <CardTitle>Top goleador</CardTitle>
          <div>
            {overview?.topScorer ? (
              <>
                <div>{`${overview.topScorer.nombre} ${overview.topScorer.apellido}`}</div>
                <small>{`${formatNumber(overview.topScorer.goles)} goles`}</small>
              </>
            ) : 'Sin datos'}
          </div>
        </Card>
        <Card>
          <CardTitle>Más presencias</CardTitle>
          <div>
            {overview?.mostPresences ? (
              <>
                <div>{`${overview.mostPresences.nombre} ${overview.mostPresences.apellido}`}</div>
                <small>{`${formatNumber(overview.mostPresences.presencias)} presencias • ${overview.mostPresences.asistencia_porcentaje ?? 0}%`}</small>
              </>
            ) : 'Sin datos'}
          </div>
        </Card>
        <Card>
          <CardTitle>Más sanciones</CardTitle>
          <div>
            {overview?.mostSanctions ? (
              <>
                <div>{`${overview.mostSanctions.nombre} ${overview.mostSanctions.apellido}`}</div>
                <small>{`${formatNumber(overview.mostSanctions.sanciones)} sanciones`}</small>
              </>
            ) : 'Sin datos'}
          </div>
        </Card>
      </Side>
    </Hero>
  );
}
