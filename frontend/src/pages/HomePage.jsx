import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { OverviewStats } from '@/components/OverviewStats';
import { SearchBar } from '@/components/SearchBar';
import { PlayerTable } from '@/components/PlayerTable';
import { MatchTable } from '@/components/MatchTable';
import { Pagination } from '@/components/Pagination';
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
  const [matchesPage, setMatchesPage] = useState(1);
  const [matchesTotalPages, setMatchesTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState('');
  const [sortBy, setSortBy] = useState('goles');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [overviewData, playersData, rankingData] = await Promise.all([
          getOverviewStats(),
          getPlayers({ page: 1, limit: 8, search: debouncedSearch, team, sortBy, order: 'desc' }),
          getPlayers({ page: 1, limit: 1000, order: 'desc', sortBy: 'goles' }),
        ]);
        setOverview(overviewData);
        setPlayers(playersData.items);
        const rankingPlayers = rankingData.items;
        setOverview((current) => ({
          ...current,
          topScorers: [...rankingPlayers].sort((a, b) => b.goles - a.goles || b.presencias - a.presencias),
          topPresences: [...rankingPlayers].sort((a, b) => b.presencias - a.presencias || b.goles - a.goles),
          topSanctions: [...rankingPlayers].sort((a, b) => b.sanciones - a.sanciones || b.goles - a.goles),
          topMvps: [...rankingPlayers].sort((a, b) => (b.mvp_count ?? 0) - (a.mvp_count ?? 0) || b.goles - a.goles),
        }));
      } catch (error) {
        Swal.fire('Error', 'No fue posible cargar las estadísticas', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedSearch, team, sortBy]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matchesData = await getMatches({ page: matchesPage, limit: 5 });
        setMatches(matchesData.items);
        setMatchesTotalPages(matchesData.meta?.totalPages || 1);
      } catch (error) {
        Swal.fire('Error', 'No fue posible cargar los partidos', 'error');
      }
    };

    loadMatches();
  }, [matchesPage]);

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
        {loading ? <SkeletonTable rows={5} /> : <PlayerTable players={players} onPlayerUpdated={(updated) => setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))} />}
      </Section>
      <Section>
        <Container>
          <Title>Últimos partidos</Title>
        </Container>
        {loading ? <SkeletonTable rows={3} /> : <MatchTable matches={matches} />}
        {!loading && matches.length ? (
          <Container>
            <Pagination
              page={matchesPage}
              totalPages={matchesTotalPages}
              onPrev={() => setMatchesPage((page) => Math.max(page - 1, 1))}
              onNext={() => setMatchesPage((page) => Math.min(page + 1, matchesTotalPages))}
            />
          </Container>
        ) : null}
      </Section>
    </motion.div>
  );
}
