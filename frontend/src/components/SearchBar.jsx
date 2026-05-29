import styled from 'styled-components';
import { TEAMS, PLAYER_SORTS } from '@/utils/constants';

const Bar = styled.div`
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.8fr;
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  border-radius: 16px;
  outline: none;
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  border-radius: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color-scheme: dark;
  caret-color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-weight: 600;
  box-shadow: none;
  text-shadow: none;
  -webkit-text-fill-color: ${({ theme }) => theme.colors.text};

  option {
    background: #081523;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export function SearchBar({ search, setSearch, team, setTeam, sortBy, setSortBy, result, setResult }) {
  return (
    <Bar>
      <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar jugador, apellido o equipo" />
      <Select value={team} onChange={(event) => setTeam(event.target.value)}>
        {TEAMS.map((option) => <option key={option} value={option === 'Todos' ? '' : option}>{option}</option>)}
      </Select>
      <Select value={sortBy || result || ''} onChange={(event) => {
        if (setSortBy) setSortBy(event.target.value);
        if (setResult) setResult(event.target.value);
      }}>
        {(PLAYER_SORTS.length ? PLAYER_SORTS : []).map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
        {setResult ? <option value="">Todos los resultados</option> : null}
      </Select>
    </Bar>
  );
}
