import React from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { EmptyState, FormField, Modal, ProgressRing, Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { toast } from '../../helpers/alerts.js';
import { tidApi } from '../../services/tid.js';
import {Award,BookOpen,Briefcase,CalendarCheck,CheckCircle2,Clock,Edit3,GraduationCap,Mail,Medal,Phone,ShieldCheck,Sparkles,Star,Target,Trophy,User,} from 'lucide-react';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const progressColor = (value) => {
  if (value >= 80) return COLORS.success;
  if (value >= 45) return COLORS.accent;
  return COLORS.warning;
};

function ProfileStat({ icon, label, value, hint, color = COLORS.accent }) {
  return (
    <div className="stat-card" style={{ minHeight: 122 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="stat-value" style={{ color }}>
            {value}
          </div>
          <div className="stat-label">{label}</div>
        </div>
        <div style={{ color, background: `${color}18`, borderRadius: 10, padding: 9, display: 'inline-flex' }}>{icon}</div>
      </div>
      {hint && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 'auto', paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>{hint}</div>}
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: COLORS.textSecondary }}>
      <span style={{ color: COLORS.textMuted, display: 'inline-flex', width: 18 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{label}</div>
        <div style={{ fontWeight: 600, color: COLORS.textPrimary, overflowWrap: 'anywhere' }}>{value || 'Sin registrarr'}</div>
      </div>
    </div>
  );
}

export default function ContributorProfilePage() {
  const { session } = useRouteLoaderData('root');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [perfil, setPerfil] = React.useState(session);
  const [form, setForm] = React.useState(session);
  const [data, setData] = React.useState({ cursos: [], inscripciones: [], calificaciones: [], asistencias: [] });

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      try {
        const [perfilActual, cursos, inscripciones, calificaciones, asistencias] = await Promise.all([
          tidApi.getPerfil(session.id),
          tidApi.getCursos(),
          tidApi.getInscripciones(session.id),
          tidApi.getCalificaciones(session.id),
          tidApi.getAsistencias(session.id),
        ]);

        if (!active) return;
        setPerfil(perfilActual);
        setForm(perfilActual);
        setData({ cursos, inscripciones, calificaciones, asistencias });
      } catch (error) {
        toast.error(error.message || 'No fue posible cargar el perfil');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [session.id]);

  const cursosPorId = React.useMemo(() => {
    const map = new Map();
    data.cursos.forEach((curso) => map.set(curso.id, curso));
    return map;
  }, [data.cursos]);

  const cursosInscritos = React.useMemo(
    () =>
      data.inscripciones
        .map((inscripcion) => ({ ...inscripcion, curso: cursosPorId.get(inscripcion.curso_id) }))
        .filter((item) => item.curso)
        .sort((a, b) => b.progreso - a.progreso),
    [cursosPorId, data.inscripciones],
  );

  const completados = cursosInscritos.filter((item) => item.estado === 'Completado' || item.progreso >= 100).length;
  const activos = cursosInscritos.filter((item) => item.estado === 'Activo' && item.progreso < 100).length;
  const progresoPromedio = cursosInscritos.length ? Math.round(cursosInscritos.reduce((sum, item) => sum + item.progreso, 0) / cursosInscritos.length) : 0;
  const promedioNotas = data.calificaciones.length ? Math.round(data.calificaciones.reduce((sum, item) => sum + item.nota, 0) / data.calificaciones.length) : 0;
  const asistencia = data.asistencias.length ? Math.round((data.asistencias.filter((item) => item.estado === 'Presente').length / data.asistencias.length) * 100) : 0;
  const horasEstimadas = cursosInscritos.reduce((sum, item) => sum + (parseInt(item.curso.duracion, 10) || 0), 0);
  const rankingLabel = completados >= 2 ? 'Top aprendiz' : progresoPromedio >= 60 ? 'En progreso' : 'Explorador';

  const achievements = [
    { label: 'Primer curso activo', active: cursosInscritos.length > 0, icon: <BookOpen size={18} /> },
    { label: 'Constancia semanal', active: asistencia >= 80, icon: <CalendarCheck size={18} /> },
    { label: 'Promedio destacado', active: promedioNotas >= 85, icon: <Star size={18} /> },
    { label: 'Ruta completada', active: completados > 0, icon: <Trophy size={18} /> },
  ];

  const handleOpenEdit = () => {
    setForm(perfil);
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!form.nombre || !form.email) {
      toast.warning('Nombre y correo son obligatorios.', 'Campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const updated = await tidApi.updatePerfil(perfil.id, {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        area: form.area,
      });
      const clean = { ...updated };
      delete clean.password;
      setPerfil(clean);
      setForm(clean);
      setEditOpen(false);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return <EmptyState icon={<User size={44} color={COLORS.textMuted} />} title="Acceso requerido" subtitle="Inicia sesion para ver tu perfil" />;
  }

  if (loading) return <Spinner text="Cargando perfil..." />;

  return (
    <div>
      <div className="page-header">
        <h2>Perfil del colaborador</h2>
        <p>Tu avance dentro del Campus TIDd</p>
      </div>

      <div className="card" style={{ marginBottom: 22, overflow: 'hidden' }}>
        <div
          style={{
            minHeight: 152,
            padding: 24,
            background: `linear-gradient(135deg, ${COLORS.accent}, #0f766e 58%, #111827)`,
            color: '#fff',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: 18,
                background: 'rgba(255,255,255,.18)',
                border: '3px solid rgba(255,255,255,.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans',
                fontSize: 32,
                fontWeight: 800,
                boxShadow: '0 14px 28px rgba(15,23,42,.22)',
              }}
            >
              {getInitials(perfil.nombre)}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,.18)', color: '#fff', marginBottom: 10 }}>
                {rankingLabel}
              </span>
              <h3 style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 800 }}>{perfil.nombre}</h3>
              <p style={{ color: 'rgba(255,255,255,.82)', marginTop: 6 }}>
                {perfil.rol} en {perfil.area || 'Campus TID'}
              </p>
            </div>
          </div>
          <button className="btn" onClick={handleOpenEdit} style={{ background: '#fff', color: COLORS.textPrimary }}>
            <Edit3 size={16} /> Editar perfil
          </button>
        </div>

        <div className="card-body">
          <div className="grid-4">
            <InfoItem icon={<Mail size={16} />} label="Correo" value={perfil.email} />
            <InfoItem icon={<Phone size={16} />} label="Telefono" value={perfil.telefono} />
            <InfoItem icon={<Briefcase size={16} />} label="Area" value={perfil.area} />
            <InfoItem icon={<ShieldCheck size={16} />} label="Rol" value={perfil.rol} />
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <ProfileStat icon={<GraduationCap size={22} />} label="Cursos activos" value={activos} hint={`${completados} completados`} color={COLORS.accent} />
        <ProfileStat icon={<Target size={22} />} label="Progreso general" value={`${progresoPromedio}%`} hint="Promedio de tus rutas" color={progressColor(progresoPromedio)} />
        <ProfileStat icon={<Medal size={22} />} label="Promedio" value={promedioNotas || '--'} hint={`${data.calificaciones.length} evaluaciones`} color={promedioNotas >= 80 ? COLORS.success : COLORS.warning} />
        <ProfileStat icon={<Clock size={22} />} label="Horas inscritas" value={`${horasEstimadas}h`} hint={`${data.asistencias.length} sesiones registradas`} color="#7e22ce" />
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Ruta de aprendizaje</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 3 }}>Inspirada en el estilo de progreso de perfiles educativos</p>
            </div>
            <ProgressRing value={progresoPromedio} size={70} stroke={7} color={progressColor(progresoPromedio)} />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cursosInscritos.length === 0 ? (
              <EmptyState icon={<BookOpen size={36} color={COLORS.textMuted} />} title="Aun no hay cursos" subtitle="Explora el catalogo para comenzar tu ruta" />
            ) : (
              cursosInscritos.map((item) => (
                <div key={item.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700 }}>{item.curso.titulo}</h4>
                      <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                        {item.curso.nivel} - {item.curso.duracion} - desde {formatDate(item.fecha)}
                      </p>
                    </div>
                    <span className={`badge ${item.progreso >= 100 ? 'badge-green' : 'badge-blue'}`}>{item.progreso >= 100 ? 'Completado' : 'Activo'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="progress-bar-bg" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${item.progreso}%`, background: progressColor(item.progreso) }}></div>
                    </div>
                    <span style={{ minWidth: 38, textAlign: 'right', fontWeight: 700, fontSize: 12, color: COLORS.textSecondary }}>{item.progreso}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Logros</h3>
            </div>
            <div className="card-body">
              <div className="grid-2" style={{ gap: 12 }}>
                {achievements.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 12,
                      borderRadius: 10,
                      border: `1px solid ${item.active ? COLORS.success : COLORS.border}`,
                      background: item.active ? 'rgba(22, 163, 74, 0.08)' : COLORS.surface2,
                      color: item.active ? COLORS.success : COLORS.textMuted,
                    }}
                  >
                    {item.active ? <CheckCircle2 size={18} /> : item.icon}
                    <span style={{ fontWeight: 700, fontSize: 13, color: item.active ? COLORS.textPrimary : COLORS.textSecondary }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Resumen academico</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Asistencia efectiva', value: `${asistencia}%`, icon: <CalendarCheck size={18} />, color: asistencia >= 80 ? COLORS.success : COLORS.warning },
                { label: 'Cursos inscritos', value: cursosInscritos.length, icon: <BookOpen size={18} />, color: COLORS.accent },
                { label: 'Insignias desbloqueadas', value: achievements.filter((item) => item.active).length, icon: <Award size={18} />, color: '#7e22ce' },
                { label: 'Proxima meta', value: progresoPromedio >= 80 ? 'Certificar' : 'Avanzar 80%', icon: <Sparkles size={18} />, color: COLORS.warning },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingBottom: 12, borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: item.color, display: 'inline-flex' }}>{item.icon}</span>
                    <span style={{ color: COLORS.textSecondary }}>{item.label}</span>
                  </div>
                  <strong style={{ color: COLORS.textPrimary }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar perfil"
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
          <FormField label="Nombre">
            <input className="form-input" value={form.nombre || ''} onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))} />
          </FormField>
          <FormField label="Correo">
            <input className="form-input" type="email" value={form.email || ''} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </FormField>
          <div className="grid-2">
            <FormField label="Telefono">
              <input className="form-input" value={form.telefono || ''} onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))} />
            </FormField>
            <FormField label="Area">
              <input className="form-input" value={form.area || ''} onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))} />
            </FormField>
          </div>
        </div>
      </Modal>
    </div>
  );
}
