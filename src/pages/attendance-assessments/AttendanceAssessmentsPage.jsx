import React from 'react';
import { useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { EmptyState, Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { CalendarCheck, ClipboardCheck, RefreshCw } from 'lucide-react';

export default function AttendanceAssessmentsPage() {
  const revalidator = useRevalidator();
  const { session } = useRouteLoaderData('root');
  const { cursos, calificaciones, asistencias } = useLoaderData();

  const [tab, setTab] = React.useState('calificaciones');
  const [filtroCurso, setFiltroCurso] = React.useState('todos');

  const cursoById = React.useMemo(() => {
    const m = new Map();
    cursos.forEach((c) => m.set(c.id, c));
    return m;
  }, [cursos]);

  const misCursoIds = React.useMemo(() => {
    const ids = new Set();
    calificaciones.forEach((c) => ids.add(c.curso_id));
    asistencias.forEach((a) => ids.add(a.curso_id));
    return Array.from(ids);
  }, [calificaciones, asistencias]);

  const misCursos = React.useMemo(() => cursos.filter((c) => misCursoIds.includes(c.id)), [cursos, misCursoIds]);

  const calFiltradas = filtroCurso === 'todos' ? calificaciones : calificaciones.filter((c) => c.curso_id === parseInt(filtroCurso));
  const asisFiltradas = filtroCurso === 'todos' ? asistencias : asistencias.filter((a) => a.curso_id === parseInt(filtroCurso));

  const promedio = calificaciones.length ? Math.round(calificaciones.reduce((s, c) => s + c.nota, 0) / calificaciones.length) : 0;
  const totalPresente = asistencias.filter((a) => a.estado === 'Presente').length;
  const pctAsistencia = asistencias.length ? Math.round((totalPresente / asistencias.length) * 100) : 0;

  if (!session) {
    return <EmptyState icon={<ClipboardCheck size={44} color={COLORS.textMuted} />} title="Acceso requerido" subtitle="Inicia sesión para ver tus evaluaciones" />;
  }

  if (revalidator.state !== 'idle') return <Spinner text="Actualizando..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h2>Asistencia y Evaluaciones</h2>
          <p>Seguimiento académico de {session.nombre}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => revalidator.revalidate()} disabled={revalidator.state !== 'idle'}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        {[
          { label: 'Promedio general', value: promedio + '/100', color: promedio >= 80 ? COLORS.success : promedio >= 60 ? COLORS.warning : COLORS.danger },
          { label: 'Evaluaciones', value: calificaciones.length, color: COLORS.accent },
          { label: 'Asistencia', value: pctAsistencia + '%', color: pctAsistencia >= 80 ? COLORS.success : COLORS.warning },
          { label: 'Sesiones', value: asistencias.length, color: COLORS.textSecondary },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="tabs">
          <button className={`tab-btn ${tab === 'calificaciones' ? 'active' : ''}`} onClick={() => setTab('calificaciones')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ClipboardCheck size={16} /> Calificaciones
            </span>
          </button>
          <button className={`tab-btn ${tab === 'asistencia' ? 'active' : ''}`} onClick={() => setTab('asistencia')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <CalendarCheck size={16} /> Asistencia
            </span>
          </button>
        </div>
        <select className="form-input" style={{ width: 'auto', minWidth: 220 }} value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
          <option value="todos">Todos los cursos</option>
          {misCursos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.titulo}
            </option>
          ))}
        </select>
      </div>

      {tab === 'calificaciones' && (
        calFiltradas.length === 0 ? (
          <EmptyState icon={<ClipboardCheck size={44} color={COLORS.textMuted} />} title="Sin calificaciones" subtitle="Aún no tienes evaluaciones registradas" />
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Actividad</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {calFiltradas.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{cursoById.get(c.curso_id)?.titulo || 'Curso'}</td>
                    <td>{c.actividad}</td>
                    <td style={{ color: COLORS.textMuted }}>{c.tipo}</td>
                    <td style={{ color: COLORS.textMuted }}>{c.fecha}</td>
                    <td>
                      <span className={`badge ${c.nota >= 80 ? 'badge-green' : c.nota >= 60 ? 'badge-yellow' : 'badge-red'}`}>{c.nota}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'asistencia' && (
        asisFiltradas.length === 0 ? (
          <EmptyState icon={<CalendarCheck size={44} color={COLORS.textMuted} />} title="Sin asistencias" subtitle="Aún no hay registros de asistencia" />
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Sesión</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {asisFiltradas.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700 }}>{cursoById.get(a.curso_id)?.titulo || 'Curso'}</td>
                    <td style={{ color: COLORS.textMuted }}>{a.sesion}</td>
                    <td style={{ color: COLORS.textMuted }}>{a.fecha}</td>
                    <td>
                      <span className={`badge ${a.estado === 'Presente' ? 'badge-green' : a.estado === 'Tardanza' ? 'badge-yellow' : 'badge-red'}`}>{a.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

