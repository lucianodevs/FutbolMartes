import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { OverviewStats } from '@/components/OverviewStats';
import { MatchTable } from '@/components/MatchTable';
import { SkeletonTable } from '@/components/SkeletonTable';
import { getOverviewStats } from '@/services/statsService';

const Wrap = styled.div`
  display: grid;
  gap: 24px;
`;

const Title = styled.h2`
  margin: 0;
`;

export function DashboardOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOverviewStats();
        setStats(data);
      } catch {
        Swal.fire('Error', 'No se pudieron cargar las métricas', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Wrap>
      <Title>Dashboard general</Title>
      {loading ? <SkeletonTable rows={2} /> : <OverviewStats stats={stats} />}
      <Title>Últimos 5 partidos</Title>
      {loading ? <SkeletonTable rows={4} /> : <MatchTable matches={stats?.recentMatches || []} />}
    </Wrap>
  );
}
