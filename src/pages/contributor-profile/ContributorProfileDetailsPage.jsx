import React from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { EmptyState, FormField, Modal, Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { toast } from '../../helpers/alerts.js';
import { tidApi } from '../../services/tid.js';
import { ArrowLeft, Calendar, CreditCard, Edit3, GraduationCap, Home, IdCard, Lock, Mail, MapPin, User } from 'lucide-react';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

function DetailItem({ icon, label, value }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, background: COLORS.surface }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: COLORS.textMuted }}>
        <span style={{ display: 'inline-flex' }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, overflowWrap: 'anywhere' }}>{value || 'Sin registrar'}</div>
    </div>
  );
}

export default function ContributorProfileDetailsPage() {
  const { session } = useRouteLoaderData('root');
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [perfil, setPerfil] = React.useState(session);
  const [form, setForm] = React.useState(session);

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      try {
        const perfilActual = await tidApi.getPerfil(session.id);
        if (active) {
          setPerfil(perfilActual);
          setForm(perfilActual);
        }
      } catch (error) {
        toast.error(error.message || 'No fue posible cargar los datos del colaborador');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [session.id]);

  if (!session) {
    return <EmptyState icon={<User size={44} color={COLORS.textMuted} />} title="Acceso requerido" subtitle="Inicia sesion para ver tus datos" />;
  }

  if (loading) return <Spinner text="Cargando datos del colaborador..." />;

  const handleOpenEdit = () => {
    setForm(perfil);
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!form.nombre || !form.email || !form.documento) {
      toast.warning('Completa nombres, correo y documento.', 'Campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const updated = await tidApi.updatePerfil(perfil.id, {
        nombre: form.nombre,
        ciudad_residencia: form.ciudad_residencia,
        direccion: form.direccion,
        fecha_nacimiento: form.fecha_nacimiento,
        email: form.email,
        nivel_academico: form.nivel_academico,
        tipo_documento: form.tipo_documento,
        documento: form.documento,
      });
      const clean = { ...updated };
      delete clean.password;
      setPerfil(clean);
      setForm(clean);
      setEditOpen(false);
      toast.success('Datos del colaborador actualizados');
    } catch (error) {
      toast.error(error.message || 'No se pudieron actualizar los datos');
    } finally {
      setSaving(false);
    }
  };

  const personalData = [
    { label: 'Nombres', value: perfil.nombre, icon: <User size={17} /> },
    { label: 'Ciudad de residencia', value: perfil.ciudad_residencia, icon: <MapPin size={17} /> },
    { label: 'Direccion', value: perfil.direccion, icon: <Home size={17} /> },
    { label: 'Fecha de nacimiento', value: perfil.fecha_nacimiento, icon: <Calendar size={17} /> },
    { label: 'Correo', value: perfil.email, icon: <Mail size={17} /> },
    { label: 'Nivel academico', value: perfil.nivel_academico, icon: <GraduationCap size={17} /> },
    { label: 'Tipo de documento', value: perfil.tipo_documento, icon: <IdCard size={17} /> },
    { label: 'Documento', value: perfil.documento, icon: <CreditCard size={17} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h2>Datos del colaborador</h2>
          <p>Informacion personal registrada en Campus TID</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/contributor-profile')}>
          <ArrowLeft size={16} /> Volver al perfil
        </button>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${COLORS.accent}, #0f766e)`,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans',
                fontSize: 24,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {getInitials(perfil.nombre)}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{perfil.nombre}</h3>
              <p style={{ color: COLORS.textSecondary, marginTop: 4 }}>
                {perfil.rol} en {perfil.area || 'Campus TID'}
              </p>
            </div>
          </div>

          <button className="btn btn-primary" type="button">
            <Lock size={16} /> Modificar contrasena
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15 }}>Informacion personal</h3>
          <button className="btn btn-secondary btn-sm" onClick={handleOpenEdit}>
            <Edit3 size={14} /> Editar datos
          </button>
        </div>
        <div className="card-body">
          <div className="grid-2">
            {personalData.map((item) => (
              <DetailItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar datos del colaborador"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditOpen(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner" style={{ width: 14, height: 14 }}></div> Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Nombres">
            <input className="form-input" value={form.nombre || ''} onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))} />
          </FormField>
          <div className="grid-2">
            <FormField label="Ciudad de residencia">
              <input className="form-input" value={form.ciudad_residencia || ''} onChange={(e) => setForm((prev) => ({ ...prev, ciudad_residencia: e.target.value }))} />
            </FormField>
            <FormField label="Fecha de nacimiento">
              <input className="form-input" type="date" value={form.fecha_nacimiento || ''} onChange={(e) => setForm((prev) => ({ ...prev, fecha_nacimiento: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Direccion">
            <input className="form-input" value={form.direccion || ''} onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))} />
          </FormField>
          <FormField label="Correo">
            <input className="form-input" type="email" value={form.email || ''} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </FormField>
          <div className="grid-2">
            <FormField label="Nivel academico">
              <select className="form-input" value={form.nivel_academico || ''} onChange={(e) => setForm((prev) => ({ ...prev, nivel_academico: e.target.value }))}>
                <option value="">Seleccionar...</option>
                <option value="Bachiller">Bachiller</option>
                <option value="Tecnico">Tecnico</option>
                <option value="Tecnologo">Tecnologo</option>
                <option value="Profesional">Profesional</option>
                <option value="Especializacion">Especializacion</option>
                <option value="Maestria">Maestria</option>
              </select>
            </FormField>
            <FormField label="Tipo de documento">
              <select className="form-input" value={form.tipo_documento || ''} onChange={(e) => setForm((prev) => ({ ...prev, tipo_documento: e.target.value }))}>
                <option value="">Seleccionar...</option>
                <option value="Cedula de ciudadania">Cedula de ciudadania</option>
                <option value="Cedula de extranjeria">Cedula de extranjeria</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </FormField>
          </div>
          <FormField label="Documento">
            <input className="form-input" value={form.documento || ''} onChange={(e) => setForm((prev) => ({ ...prev, documento: e.target.value }))} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
