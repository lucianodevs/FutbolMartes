import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatNumber } from '@/utils/formatters';

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
  min-width: 1050px;

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

const CardName = styled.div`
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
  background: rgba(61,220,151,0.14);
  color: ${({ theme }) => theme.colors.primary};
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

  @media (max-width: 720px) {
    padding: 28px 20px;
  }
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

      <Cards>
        {players.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle>
                <CardSubtle>ID {player.id}</CardSubtle>
                <CardName>{player.nombre} {player.apellido}</CardName>
              </CardTitle>
              <Badge>{player.equipo}</Badge>
            </CardHeader>

            <Stats>
              <Stat>
                <StatLabel>Goles</StatLabel>
                <StatValue>{formatNumber(player.goles)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Presencia</StatLabel>
                <StatValue>{player.asistencia_porcentaje}%</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Presencias</StatLabel>
                <StatValue>{formatNumber(player.presencias)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Sanciones</StatLabel>
                <StatValue>{formatNumber(player.sanciones)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Pecheras</StatLabel>
                <StatValue>{formatNumber(player.pecheras_llevadas)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Sin lavar</StatLabel>
                <StatValue>{formatNumber(player.pecheras_sin_lavar)}</StatValue>
              </Stat>
            </Stats>

            {hasActions ? (
              <CardActions>
                {typeof onEdit === 'function' ? <Action onClick={() => onEdit(player)} aria-label={`Editar ${player.nombre} ${player.apellido}`}><FiEdit2 /></Action> : null}
                {typeof onDelete === 'function' ? <Action $danger onClick={() => onDelete(player)} aria-label={`Eliminar ${player.nombre} ${player.apellido}`}><FiTrash2 /></Action> : null}
              </CardActions>
            ) : null}
          </Card>
        ))}
      </Cards>
    </Wrap>
  );
}
