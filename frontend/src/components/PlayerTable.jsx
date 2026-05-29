import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatNumber } from '@/utils/formatters';
import { Modal } from './Modal';
import { uploadPlayerPhoto } from '@/services/playerService';
import { useAuth } from '@/hooks/useAuth';

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

const Photo = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SmallPhoto = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-right: 12px;
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 18px;
  align-items: start;
`;

const ModalLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`;

const ModalValue = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
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

export function PlayerTable({ players, onEdit, onDelete, onPlayerUpdated }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const closeModal = () => setSelectedPlayer(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  if (!players?.length) {
    return <Wrap><Empty>No hay jugadores para mostrar.</Empty></Wrap>;
  }

  const hasActions = typeof onEdit === 'function' || typeof onDelete === 'function';
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  const publicUrl = (fotoPath) => {
    if (!fotoPath) return null;
    if (fotoPath.startsWith('http://') || fotoPath.startsWith('https://')) return fotoPath;
    return `${apiUrl}${fotoPath}`;
  };
  const placeholderDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280"><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="#fff">Jugador</text></svg>')}`;

  return (
    <Wrap>
      <Table>
        <thead>
          <tr>
            <TH>Nombre</TH><TH>Apellido</TH><TH>Equipo</TH><TH>Goles</TH><TH>Presencias</TH><TH>% Presencia</TH><TH>Sanciones</TH><TH>Pecheras</TH><TH>Sin lavar</TH>{hasActions ? <TH>Acciones</TH> : null}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <TD onClick={() => setSelectedPlayer(player)} style={{ cursor: 'pointer' }} title="Ver jugador">{player.nombre}</TD>
              <TD>{player.apellido}</TD>
              <TD>{player.equipo}</TD>
              <TD>{formatNumber(player.goles)}</TD>
              <TD>{formatNumber(player.presencias)}</TD>
              <TD>{player.asistencia_porcentaje}%</TD>
              <TD>{formatNumber(player.sanciones)}</TD>
              <TD>{formatNumber(player.pecheras_llevadas)}</TD>
              <TD>{formatNumber(player.pecheras_sin_lavar)}</TD>
              {hasActions && isAdmin ? (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SmallPhoto src={publicUrl(player.foto) || placeholderDataUrl} alt={`${player.nombre}`} />
                <CardTitle>
                  <CardSubtle>{player.equipo}</CardSubtle>
                  <CardName onClick={() => setSelectedPlayer(player)} style={{ cursor: 'pointer' }}>{player.nombre} {player.apellido}</CardName>
                </CardTitle>
              </div>
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

            {hasActions && isAdmin ? (
              <CardActions>
                {typeof onEdit === 'function' ? <Action onClick={() => onEdit(player)} aria-label={`Editar ${player.nombre} ${player.apellido}`}><FiEdit2 /></Action> : null}
                {typeof onDelete === 'function' ? <Action $danger onClick={() => onDelete(player)} aria-label={`Eliminar ${player.nombre} ${player.apellido}`}><FiTrash2 /></Action> : null}
              </CardActions>
            ) : null}
          </Card>
        ))}
      </Cards>

      <Modal open={!!selectedPlayer} title={selectedPlayer ? `${selectedPlayer.nombre} ${selectedPlayer.apellido}` : ''} onClose={closeModal}>
        {selectedPlayer && (
          <ModalGrid>
            <Photo src={publicUrl(selectedPlayer.foto) || placeholderDataUrl} alt={`${selectedPlayer.nombre} ${selectedPlayer.apellido}`} />
            <div>
              <ModalLabel>Equipo</ModalLabel>
              <ModalValue>{selectedPlayer.equipo}</ModalValue>

              <ModalLabel>Goles</ModalLabel>
              <ModalValue>{formatNumber(selectedPlayer.goles)}</ModalValue>

              <ModalLabel>Presencias</ModalLabel>
              <ModalValue>{formatNumber(selectedPlayer.presencias)} ({selectedPlayer.asistencia_porcentaje}%)</ModalValue>

              <ModalLabel>Sanciones</ModalLabel>
              <ModalValue>{formatNumber(selectedPlayer.sanciones)}</ModalValue>

              <ModalLabel>Pecheras llevadas</ModalLabel>
              <ModalValue>{formatNumber(selectedPlayer.pecheras_llevadas)}</ModalValue>

              <ModalLabel>Pecheras sin lavar</ModalLabel>
              <ModalValue>{formatNumber(selectedPlayer.pecheras_sin_lavar)}</ModalValue>
            </div>
            {hasActions && isAdmin ? (
              <CardActions style={{ marginTop: 12 }}>
                {typeof onEdit === 'function' ? <Action onClick={() => { onEdit(selectedPlayer); closeModal(); }} aria-label={`Editar ${selectedPlayer.nombre}`}><FiEdit2 /></Action> : null}
                {typeof onDelete === 'function' ? <Action $danger onClick={() => { onDelete(selectedPlayer); closeModal(); }} aria-label={`Eliminar ${selectedPlayer.nombre}`}><FiTrash2 /></Action> : null}
              </CardActions>
            ) : null}
            {isAdmin ? (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  Subir foto (max 2MB):
                </label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  // validar tipo y tamaño
                  if (!file.type.startsWith('image/')) {
                    alert('Por favor seleccioná una imagen');
                    return;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    alert('El archivo supera el límite de 2MB');
                    return;
                  }
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }} />
                {previewUrl ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={previewUrl} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }} />
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <Action onClick={async () => {
                        if (!selectedFile) return;
                        // doble validación antes de subir
                        if (!selectedFile.type.startsWith('image/')) {
                          alert('Archivo inválido');
                          return;
                        }
                        if (selectedFile.size > 2 * 1024 * 1024) {
                          alert('El archivo supera el límite de 2MB');
                          return;
                        }
                        try {
                          setUploading(true);
                          const updated = await uploadPlayerPhoto(selectedPlayer.id, selectedFile);
                          setSelectedPlayer(updated);
                          if (typeof onPlayerUpdated === 'function') onPlayerUpdated(updated);
                          // limpiar preview
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        } catch (err) {
                          console.error('Upload error', err);
                          alert('Error al subir la imagen');
                        } finally {
                          setUploading(false);
                        }
                      }}>{uploading ? 'Subiendo...' : 'Subir'}</Action>
                      <Action $danger onClick={() => {
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}>Cancelar</Action>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </ModalGrid>
        )}
      </Modal>
    </Wrap>
  );
}
