import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '@/utils/formatters';

const Wrap = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 22px auto 0;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.035);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
`;

const TH = styled.th`
  padding: 16px 14px;
  text-align: left;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(255,255,255,0.03);
`;

const TD = styled.td`
  padding: 16px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
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
    </Wrap>
  );
}
