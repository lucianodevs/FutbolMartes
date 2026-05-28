import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { OverviewStats } from '@/components/OverviewStats';
import { MatchTable } from '@/components/MatchTable';
import { SkeletonTable } from '@/components/SkeletonTable';
import { getOverviewStats } from '@/services/statsService';
import { exportAllData } from '@/services/statsService';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

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
      {user?.rol === 'admin' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const buffer = await exportAllData();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'futbol_datos.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                Swal.fire('Error', 'No se pudo descargar el Excel', 'error');
              } finally {
                setLoading(false);
              }
            }}
          >
            Exportar Excel
          </button>
        </div>
      )}
      {loading ? <SkeletonTable rows={2} /> : <OverviewStats stats={stats} />}
      <Title>Últimos 5 partidos</Title>
      {loading ? <SkeletonTable rows={4} /> : <MatchTable matches={stats?.recentMatches || []} />}
    </Wrap>
  );
}
