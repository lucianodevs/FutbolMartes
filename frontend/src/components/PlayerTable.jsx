import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatNumber } from '@/utils/formatters';

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
  min-width: 1050px;
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
  background: ${({ $danger, theme }) => ($danger ? 'rgba(255,107,107,0.14)' : 'rgba(61,220,151,0.14)')};
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

export function PlayerTable({ players, onEdit, onDelete }) {
  if (!players?.length) {
    return <Wrap><Empty>No hay jugadores para mostrar.</Empty></Wrap>;
  }

  const hasActions = typeof onEdit === 'function' || typeof onDelete === 'function';

  return (
    <Wrap>
      <Table>
        <thead>
          <tr>
            <TH>ID</TH><TH>Nombre</TH><TH>Apellido</TH><TH>Equipo</TH><TH>Goles</TH><TH>Presencias</TH><TH>% Presencia</TH><TH>Sanciones</TH><TH>Pecheras</TH><TH>Sin lavar</TH>{hasActions ? <TH>Acciones</TH> : null}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <TD>{player.id}</TD>
              <TD>{player.nombre}</TD>
              <TD>{player.apellido}</TD>
              <TD>{player.equipo}</TD>
              <TD>{formatNumber(player.goles)}</TD>
              <TD>{formatNumber(player.presencias)}</TD>
              <TD>{player.asistencia_porcentaje}%</TD>
              <TD>{formatNumber(player.sanciones)}</TD>
              <TD>{formatNumber(player.pecheras_llevadas)}</TD>
              <TD>{formatNumber(player.pecheras_sin_lavar)}</TD>
              {hasActions ? (
                <TD>
                  <RowActions>
                    {typeof onEdit === 'function' ? <Action onClick={() => onEdit(player)}><FiEdit2 /></Action> : null}
                    {typeof onDelete === 'function' ? <Action $danger onClick={() => onDelete(player)}><FiTrash2 /></Action> : null}
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
