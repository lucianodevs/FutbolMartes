import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers } from 'react-icons/fi';
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 174px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
`;

const TeamBadges = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 68px;
`;

const TeamBadgeLogo = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 18px;
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
  grid-auto-flow: column;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(3, auto);
  column-gap: 20px;
  row-gap: 8px;

  @media (max-width: 560px) {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
`;

const RankingItem = styled.li`
  color: ${({ theme }) => theme.colors.text};

  small {
    display: block;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const RankingPlayer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const RankingLogo = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 5px;
`;

function RankingCard({ title, items, detailBuilder }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {!items?.length ? (
        <div>Sin datos</div>
      ) : (
        <RankingList>
          {items.slice(0, 6).map((item) => (
            <RankingItem key={`${title}-${item.id}`}>
              <RankingPlayer>
                <RankingLogo
                  src={item.equipo === 'Dictadores' ? '/images/escudo-dictadores.jpeg' : '/images/escudo-tramposos.jpeg'}
                  alt=""
                />
                {item.nombre} {item.apellido}
              </RankingPlayer>
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
        <Badge>
          <TeamBadges aria-label="Equipos participantes">
            <TeamBadgeLogo src="/images/escudo-dictadores.jpeg" alt="Escudo de Dictadores FC" />
            <TeamBadgeLogo src="/images/escudo-tramposos.jpeg" alt="Escudo de Tramposos FC" />
          </TeamBadges>
        </Badge>
        <Title>El panel del grupo de amigos que vive el fútbol todos los martes.</Title>
        <Text>
          Seguimos los partidos, goles, presencias y sanciones de Dictadores vs. Tramposos con una vista simple, rápida y hecha para nuestro juego entre amigos.
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
