import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { FiPlus } from 'react-icons/fi';
import { Modal } from '@/components/Modal';
import { MatchTable } from '@/components/MatchTable';
import { Pagination } from '@/components/Pagination';
import { SkeletonTable } from '@/components/SkeletonTable';
import { getMatches, createMatch, updateMatch, deleteMatch } from '@/services/matchService';
import { getPlayers } from '@/services/playerService';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const Button = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: #06101c;
  padding: 13px 16px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 13px 14px;
  border-radius: 14px;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 13px 14px;
  border-radius: 14px;
`;

const Textarea = styled.textarea`
  min-height: 120px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 13px 14px;
  border-radius: 14px;
  grid-column: 1 / -1;
`;

const Actions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Secondary = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 16px;
  border-radius: 14px;
  cursor: pointer;
`;

export function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ fecha: '', equipo_local: 'Dictadores', equipo_visitante: 'Tramposos', goles_local: 0, goles_visitante: 0, ganador: 'Dictadores', observaciones: '', mvp_jugador_id: '' });

  const loadPlayers = async () => {
    try {
      const data = await getPlayers({ page: 1, limit: 300, order: 'asc', sortBy: 'apellido' });
      setPlayers(data.items || []);
    } catch {
      setPlayers([]);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches({ page, limit: 8 });
      setMatches(data.items);
      setMeta(data.meta);
    } catch {
      Swal.fire('Error', 'No fue posible cargar los partidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [page]);

  useEffect(() => {
    loadPlayers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ fecha: '', equipo_local: 'Dictadores', equipo_visitante: 'Tramposos', goles_local: 0, goles_visitante: 0, ganador: 'Dictadores', observaciones: '', mvp_jugador_id: '' });
    setModalOpen(true);
  };

  const openEdit = (match) => {
    setEditing(match);
    setForm({
      fecha: match.fecha?.slice(0, 10) || '',
      equipo_local: match.equipo_local,
      equipo_visitante: match.equipo_visitante,
      goles_local: match.goles_local,
      goles_visitante: match.goles_visitante,
      ganador: match.ganador,
      observaciones: match.observaciones || '',
      mvp_jugador_id: match.mvp_jugador_id ? String(match.mvp_jugador_id) : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await updateMatch(editing.id, form);
        Swal.fire({ icon: 'success', title: 'Partido actualizado', timer: 1200, showConfirmButton: false });
      } else {
        await createMatch(form);
        Swal.fire({ icon: 'success', title: 'Partido creado', timer: 1200, showConfirmButton: false });
      }
      setModalOpen(false);
      await loadMatches();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el partido', 'error');
    }
  };

  const handleDelete = async (match) => {
    const confirmation = await Swal.fire({
      title: `Eliminar partido ${match.id}`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await deleteMatch(match.id);
      Swal.fire({ icon: 'success', title: 'Partido eliminado', timer: 1200, showConfirmButton: false });
      await loadMatches();
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el partido', 'error');
    }
  };

  return (
    <>
      <Header>
        <div>
          <h2>Gestión de partidos</h2>
          <p>Registro de resultados, victorias y empates.</p>
        </div>
        <Button onClick={openCreate}><FiPlus /> Nuevo partido</Button>
      </Header>

      {loading ? <SkeletonTable rows={8} /> : <MatchTable matches={matches} onEdit={openEdit} onDelete={handleDelete} />}

      <Pagination page={page} totalPages={meta.totalPages} onPrev={() => setPage((value) => Math.max(1, value - 1))} onNext={() => setPage((value) => Math.min(meta.totalPages, value + 1))} />

      <Modal open={modalOpen} title={editing ? 'Editar partido' : 'Crear partido'} onClose={() => setModalOpen(false)}>
        <Form onSubmit={handleSubmit}>
          <Field>Fecha<Input type="date" value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} /></Field>
          <Field>Local<Select value={form.equipo_local} onChange={(event) => setForm({ ...form, equipo_local: event.target.value })}><option>Dictadores</option><option>Tramposos</option></Select></Field>
          <Field>Visitante<Select value={form.equipo_visitante} onChange={(event) => setForm({ ...form, equipo_visitante: event.target.value })}><option>Dictadores</option><option>Tramposos</option></Select></Field>
          <Field>Goles local<Input type="number" value={form.goles_local} onChange={(event) => setForm({ ...form, goles_local: event.target.value })} /></Field>
          <Field>Goles visitante<Input type="number" value={form.goles_visitante} onChange={(event) => setForm({ ...form, goles_visitante: event.target.value })} /></Field>
          <Field>Ganador<Select value={form.ganador} onChange={(event) => setForm({ ...form, ganador: event.target.value })}><option>Dictadores</option><option>Tramposos</option><option>Empate</option></Select></Field>
          <Field>
            MVP
            <Select value={form.mvp_jugador_id} onChange={(event) => setForm({ ...form, mvp_jugador_id: event.target.value })}>
              <option value="">Sin MVP</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.nombre} {player.apellido}</option>
              ))}
            </Select>
          </Field>
          <Textarea placeholder="Observaciones" value={form.observaciones} onChange={(event) => setForm({ ...form, observaciones: event.target.value })} />
          <Actions>
            <Secondary type="button" onClick={() => setModalOpen(false)}>Cancelar</Secondary>
            <Button type="submit">Guardar</Button>
          </Actions>
        </Form>
      </Modal>
    </>
  );
}
