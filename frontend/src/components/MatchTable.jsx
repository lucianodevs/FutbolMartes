import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '@/utils/formatters';

const Wrap = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 22px auto 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.035);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const Cards = styled.div`
  display: none;
  padding: 14px;
  gap: 12px;

  @media (max-width: 720px) {
    display: grid;
  }
`;

const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  border-radius: 18px;
  padding: 14px;
  display: grid;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`;

const CardTitle = styled.div`
  display: grid;
  gap: 4px;
`;

const CardDate = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

const CardSubtle = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(77,163,255,0.14);
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.8rem;
  font-weight: 700;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const Stat = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  display: grid;
  gap: 3px;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
`;

const StatValue = styled.div`
  font-weight: 700;
`;

const Summary = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  display: grid;
  gap: 3px;
`;

const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
`;

const SummaryValue = styled.div`
  font-weight: 700;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
`;

const TH = styled.th`
  padding: 16px 14px;
  text-align: left;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(255,255,255,0.03);

  @media (max-width: 720px) {
    padding: 12px 10px;
    font-size: 0.82rem;
  }
`;

const TD = styled.td`
  padding: 16px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);

  @media (max-width: 720px) {
    padding: 12px 10px;
    font-size: 0.88rem;
  }
`;

const RowActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Action = styled.button`
  border: 0;
  background: ${({ $danger }) => ($danger ? 'rgba(255,107,107,0.14)' : 'rgba(61,220,151,0.14)')};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.primary)};
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};

  @media (max-width: 720px) {
    padding: 28px 20px;
  }
`;

export function MatchTable({ matches, onEdit, onDelete }) {
  if (!matches?.length) {
    return <Wrap><Empty>No hay partidos para mostrar.</Empty></Wrap>;
  }

  const hasActions = typeof onEdit === 'function' || typeof onDelete === 'function';

  return (
    <Wrap>
      <Table>
        <thead>
          <tr>
            <TH>ID</TH><TH>Fecha</TH><TH>Local</TH><TH>Visitante</TH><TH>Resultado</TH><TH>Goles</TH><TH>MVP</TH><TH>Observaciones</TH>{hasActions ? <TH>Acciones</TH> : null}
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <TD>{match.id}</TD>
              <TD>{formatDate(match.fecha)}</TD>
              <TD>{match.equipo_local}</TD>
              <TD>{match.equipo_visitante}</TD>
              <TD>{match.ganador}</TD>
              <TD>{match.goles_local} - {match.goles_visitante}</TD>
              <TD>{match.mvp_nombre ? `${match.mvp_nombre} ${match.mvp_apellido || ''}`.trim() : '-'}</TD>
              <TD>{match.observaciones || '-'}</TD>
              {hasActions ? (
                <TD>
                  <RowActions>
                    {typeof onEdit === 'function' ? <Action onClick={() => onEdit(match)}><FiEdit2 /></Action> : null}
                    {typeof onDelete === 'function' ? <Action $danger onClick={() => onDelete(match)}><FiTrash2 /></Action> : null}
                  </RowActions>
                </TD>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>

      <Cards>
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <CardTitle>
                <CardSubtle>ID {match.id}</CardSubtle>
                <CardDate>{formatDate(match.fecha)}</CardDate>
              </CardTitle>
              <Badge>{match.ganador}</Badge>
            </CardHeader>

            <Stats>
              <Summary>
                <SummaryLabel>Local</SummaryLabel>
                <SummaryValue>{match.equipo_local}</SummaryValue>
              </Summary>
              <Summary>
                <SummaryLabel>Visitante</SummaryLabel>
                <SummaryValue>{match.equipo_visitante}</SummaryValue>
              </Summary>
              <Summary>
                <SummaryLabel>Resultado</SummaryLabel>
                <SummaryValue>{match.goles_local} - {match.goles_visitante}</SummaryValue>
              </Summary>
              <Summary>
                <SummaryLabel>MVP</SummaryLabel>
                <SummaryValue>{match.mvp_nombre ? `${match.mvp_nombre} ${match.mvp_apellido || ''}`.trim() : '-'}</SummaryValue>
              </Summary>
            </Stats>

            <Summary>
              <SummaryLabel>Observaciones</SummaryLabel>
              <SummaryValue>{match.observaciones || '-'}</SummaryValue>
            </Summary>

            {hasActions ? (
              <CardActions>
                {typeof onEdit === 'function' ? <Action onClick={() => onEdit(match)} aria-label={`Editar partido ${match.id}`}><FiEdit2 /></Action> : null}
                {typeof onDelete === 'function' ? <Action $danger onClick={() => onDelete(match)} aria-label={`Eliminar partido ${match.id}`}><FiTrash2 /></Action> : null}
              </CardActions>
            ) : null}
          </Card>
        ))}
      </Cards>
    </Wrap>
  );
}
