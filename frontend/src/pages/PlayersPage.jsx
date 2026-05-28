import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { FiPlus } from 'react-icons/fi';
import { Modal } from '@/components/Modal';
import { PlayerTable } from '@/components/PlayerTable';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { SkeletonTable } from '@/components/SkeletonTable';
import { useDebounce } from '@/hooks/useDebounce';
import { createPlayer, deletePlayer, getPlayers, updatePlayer } from '@/services/playerService';

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

export function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState('');
  const [sortBy, setSortBy] = useState('goles');
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', equipo: 'Dictadores', goles: 0, presencias: 0, sanciones: 0, pecheras_llevadas: 0, pecheras_sin_lavar: 0 });

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers({ page, limit: 8, search: debouncedSearch, team, sortBy, order: 'desc' });
      setPlayers(data.items);
      setMeta(data.meta);
    } catch {
      Swal.fire('Error', 'No fue posible cargar los jugadores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [page, debouncedSearch, team, sortBy]);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', apellido: '', equipo: 'Dictadores', goles: 0, presencias: 0, sanciones: 0, pecheras_llevadas: 0, pecheras_sin_lavar: 0 });
    setModalOpen(true);
  };

  const openEdit = (player) => {
    setEditing(player);
    setForm({
      nombre: player.nombre,
      apellido: player.apellido,
      equipo: player.equipo,
      goles: player.goles,
      presencias: player.presencias,
      sanciones: player.sanciones,
      pecheras_llevadas: player.pecheras_llevadas,
      pecheras_sin_lavar: player.pecheras_sin_lavar,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nombre || !form.apellido) {
      Swal.fire('Validación', 'Nombre y apellido son obligatorios', 'warning');
      return;
    }

    try {
      if (editing) {
        await updatePlayer(editing.id, form);
        Swal.fire({ icon: 'success', title: 'Jugador actualizado', timer: 1200, showConfirmButton: false });
      } else {
        await createPlayer(form);
        Swal.fire({ icon: 'success', title: 'Jugador creado', timer: 1200, showConfirmButton: false });
      }
      setModalOpen(false);
      await loadPlayers();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el jugador', 'error');
    }
  };

  const handleDelete = async (player) => {
    const confirmation = await Swal.fire({
      title: `Eliminar a ${player.nombre} ${player.apellido}`,
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
      await deletePlayer(player.id);
      Swal.fire({ icon: 'success', title: 'Jugador eliminado', timer: 1200, showConfirmButton: false });
      await loadPlayers();
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el jugador', 'error');
    }
  };

  return (
    <>
      <Header>
        <div>
          <h2>Gestión de jugadores</h2>
          <p>CRUD completo con validaciones, filtros y paginación.</p>
        </div>
        <Button onClick={openCreate}><FiPlus /> Nuevo jugador</Button>
      </Header>

      <SearchBar search={search} setSearch={setSearch} team={team} setTeam={setTeam} sortBy={sortBy} setSortBy={setSortBy} />

      {loading ? <SkeletonTable rows={8} /> : <PlayerTable players={players} onEdit={openEdit} onDelete={handleDelete} />}

      <Pagination page={page} totalPages={meta.totalPages} onPrev={() => setPage((value) => Math.max(1, value - 1))} onNext={() => setPage((value) => Math.min(meta.totalPages, value + 1))} />

      <Modal open={modalOpen} title={editing ? 'Editar jugador' : 'Crear jugador'} onClose={() => setModalOpen(false)}>
        <Form onSubmit={handleSubmit}>
          <Field>Nombre<Input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></Field>
          <Field>Apellido<Input value={form.apellido} onChange={(event) => setForm({ ...form, apellido: event.target.value })} /></Field>
          <Field>Equipo<Select value={form.equipo} onChange={(event) => setForm({ ...form, equipo: event.target.value })}><option>Dictadores</option><option>Tramposos</option></Select></Field>
          <Field>Goles<Input type="number" value={form.goles} onChange={(event) => setForm({ ...form, goles: event.target.value })} /></Field>
          <Field>Presencias<Input type="number" value={form.presencias} onChange={(event) => setForm({ ...form, presencias: event.target.value })} /></Field>
          <Field>Sanciones<Input type="number" value={form.sanciones} onChange={(event) => setForm({ ...form, sanciones: event.target.value })} /></Field>
          <Field>Pecheras llevadas<Input type="number" value={form.pecheras_llevadas} onChange={(event) => setForm({ ...form, pecheras_llevadas: event.target.value })} /></Field>
          <Field>Pecheras sin lavar<Input type="number" value={form.pecheras_sin_lavar} onChange={(event) => setForm({ ...form, pecheras_sin_lavar: event.target.value })} /></Field>
          <Actions>
            <Secondary type="button" onClick={() => setModalOpen(false)}>Cancelar</Secondary>
            <Button type="submit">Guardar</Button>
          </Actions>
        </Form>
      </Modal>
    </>
  );
}
