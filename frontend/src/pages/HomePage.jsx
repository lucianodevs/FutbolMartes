import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { OverviewStats } from '@/components/OverviewStats';
import { SearchBar } from '@/components/SearchBar';
import { PlayerTable } from '@/components/PlayerTable';
import { MatchTable } from '@/components/MatchTable';
import { SkeletonTable } from '@/components/SkeletonTable';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { getOverviewStats } from '@/services/statsService';
import { getPlayers } from '@/services/playerService';
import { getMatches } from '@/services/matchService';

const Section = styled.section`
  margin-top: 24px;
`;

const Container = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 26px auto 0;
`;

const Title = styled.h2`
  margin: 0 0 16px;
`;

export function HomePage() {
  const [overview, setOverview] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState('');
  const [sortBy, setSortBy] = useState('goles');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [overviewData, playersData, matchesData] = await Promise.all([
          getOverviewStats(),
          getPlayers({ page: 1, limit: 8, search: debouncedSearch, team, sortBy, order: 'desc' }),
          getMatches({ page: 1, limit: 5 }),
        ]);
        setOverview(overviewData);
        setPlayers(playersData.items);
        setMatches(matchesData.items);
      } catch (error) {
        Swal.fire('Error', 'No fue posible cargar las estadísticas', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedSearch, team, sortBy]);

  if (loading && !overview) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <HeroSection overview={overview} />
      <OverviewStats stats={overview} />
      <Section>
        <Container>
          <Title>Buscar y ordenar jugadores</Title>
        </Container>
        <SearchBar search={search} setSearch={setSearch} team={team} setTeam={setTeam} sortBy={sortBy} setSortBy={setSortBy} />
        {loading ? <SkeletonTable rows={5} /> : <PlayerTable players={players} />}
      </Section>
      <Section>
        <Container>
          <Title>Últimos partidos</Title>
        </Container>
        {loading ? <SkeletonTable rows={3} /> : <MatchTable matches={matches} />}
      </Section>
    </motion.div>
  );
}
