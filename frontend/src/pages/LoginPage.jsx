import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const Shell = styled.div`
  min-height: calc(100vh - 1px);
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.div`
  width: min(480px, 100%);
  background: rgba(18,35,59,0.9);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h1`
  margin: 0 0 8px;
`;

const Text = styled.p`
  margin-top: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
  margin-top: 22px;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  border-radius: 16px;
`;

const Button = styled.button`
  border: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #7cf9c0);
  color: #06101c;
  padding: 14px 16px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
`;

export function LoginPage() {
  const [form, setForm] = useState({ email: 'admin@futbol.com', password: 'Admin123!' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await login(form);
      Swal.fire({ icon: 'success', title: 'Sesión iniciada', timer: 1200, showConfirmButton: false });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo iniciar sesión', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Card>
        <Title>Acceso administrativo</Title>
        <Text>Ingresá al dashboard para administrar jugadores y partidos.</Text>
        <Form onSubmit={handleSubmit}>
          <Field>
            <label><FiMail /> Email</label>
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field>
            <label><FiLock /> Password</label>
            <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </Field>
          <Button type="submit" disabled={submitting}>{submitting ? 'Ingresando...' : <><FiLogIn /> Entrar</>}</Button>
        </Form>
      </Card>
    </Shell>
  );
}
