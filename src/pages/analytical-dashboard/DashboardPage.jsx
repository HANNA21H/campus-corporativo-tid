import React from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { BookOpen, ClipboardCheck, ClipboardList, LayoutDashboard, Megaphone, RefreshCw, Tags, Trophy, Users, User } from 'lucide-react';

function BarChart({ data, valueKey, labelKey, color = COLORS.accent }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120, padding: '0 4px' }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600 }}>{d[valueKey]}</span>
            <div style={{ width: '100%', height: `${Math.max(pct, 4)}%`, background: color, borderRadius: '4px 4px 0 0', transition: 'height .6s', opacity: 0.85 }}></div>
            <span style={{ fontSize: 9, color: COLORS.textMuted, textAlign: 'center', lineHeight: 1.2, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ activos, completados, total }) {
  const size = 120,
    stroke = 14,
    r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pctA = total ? activos / total : 0;
  const pctC = total ? completados / total : 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.accent} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pctA)} strokeLinecap="butt" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={COLORS.success}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pctC)}
        strokeLinecap="butt"
        style={{ transform: `rotate(${pctA * 360}deg)`, transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: COLORS.textPrimary, fontSize: '20px', fontWeight: 700, fontFamily: 'DM Sans' }}
      >
        {total}
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { metrics } = useLoaderData();
  const [tab, setTab] = React.useState('resumen');

  if (!metrics) return <Spinner text="Cargando dashboard..." />;

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard size={16} /> },
    { id: 'cursos', label: 'Cursos', icon: <BookOpen size={16} /> },
    { id: 'inscripciones', label: 'Inscripciones', icon: <ClipboardList size={16} /> },
    { id: 'categorias', label: 'Categorías', icon: <Tags size={16} /> },
  ];

  const navMap = {
    cursos: '/course-catalog',
    inscripciones: '/registration-management',
    asistencia: '/attendance-assessments',
    comunicaciones: '/internal-comunications',
    perfil: '/contributor-profile',
  };

  const onNavigate = (key) => {
    const to = navMap[key];
    if (to) navigate(to);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h2>Dashboard Analítico</h2>
          <p>Métricas actualizadas · {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => revalidator.revalidate()} disabled={revalidator.state !== 'idle'}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {revalidator.state !== 'idle' && <Spinner text="Actualizando..." />}

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total usuarios', value: metrics.totalUsuarios, icon: <Users size={26} />, color: COLORS.accent, delta: '+2 este mes' },
          { label: 'Cursos disponibles', value: metrics.totalCursos, icon: <BookOpen size={26} />, color: COLORS.warning, delta: '+1 nuevo' },
          { label: 'Inscripciones totales', value: metrics.totalInscripciones, icon: <ClipboardList size={26} />, color: COLORS.success, delta: `${metrics.inscripcionesActivas} activas` },
          {
            label: 'Completados',
            value: metrics.inscripcionesCompletadas,
            icon: <Trophy size={26} />,
            color: '#7e22ce',
            delta: `${metrics.totalInscripciones ? Math.round((metrics.inscripcionesCompletadas / metrics.totalInscripciones) * 100) : 0}% del total`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="stat-card" style={{ gap: 10 }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div className="stat-value" style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
                <div className="stat-label">{kpi.label}</div>
              </div>
              <div style={{ color: COLORS.textMuted, opacity: 0.9 }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {t.icon} {t.label}
            </span>
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Estado de Inscripciones</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <DonutChart activos={metrics.inscripcionesActivas} completados={metrics.inscripcionesCompletadas} total={metrics.totalInscripciones} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Activas', value: metrics.inscripcionesActivas, color: COLORS.accent },
                  { label: 'Completadas', value: metrics.inscripcionesCompletadas, color: COLORS.success },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 20 }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Cursos por Categoría</h3>
            </div>
            <div className="card-body">
              <BarChart data={metrics.categorias.filter((c) => c.totalCursos > 0)} valueKey="totalCursos" labelKey="nombre" color={COLORS.accent} />
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Acciones rápidas</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'Explorar cursos', icon: <BookOpen size={16} />, nav: 'cursos' },
                  { label: 'Mis inscripciones', icon: <ClipboardList size={16} />, nav: 'inscripciones' },
                  { label: 'Mis calificaciones', icon: <ClipboardCheck size={16} />, nav: 'asistencia' },
                  { label: 'Comunicaciones', icon: <Megaphone size={16} />, nav: 'comunicaciones' },
                  { label: 'Mi perfil', icon: <User size={16} />, nav: 'perfil' },
                ].map((a) => (
                  <button key={a.nav} className="btn btn-secondary" onClick={() => onNavigate(a.nav)} style={{ flex: '1 1 140px', justifyContent: 'center', padding: '12px 16px', fontSize: 13 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {a.icon} {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'cursos' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Top cursos por inscripciones</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Curso</th>
                <th>Inscritos</th>
                <th>Cupo máx.</th>
                <th>Ocupación</th>
              </tr>
            </thead>
            <tbody>
              {metrics.cursosMasInscritos.map((c, i) => {
                const pct = Math.round((c.inscritos / c.max) * 100);
                return (
                  <tr key={c.id}>
                    <td style={{ color: COLORS.textMuted, fontWeight: 700 }}>#{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.titulo}</td>
                    <td>{c.inscritos}</td>
                    <td style={{ color: COLORS.textMuted }}>{c.max}</td>
                    <td style={{ minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="progress-bar-bg" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: pct + '%', background: pct >= 90 ? COLORS.danger : pct >= 70 ? COLORS.warning : COLORS.success }}></div>
                        </div>
                        <span style={{ fontSize: 12, minWidth: 36, textAlign: 'right', color: COLORS.textMuted }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'inscripciones' && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Resumen de inscripciones</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Total inscripciones', value: metrics.totalInscripciones, color: COLORS.textPrimary },
                { label: 'Activas', value: metrics.inscripcionesActivas, color: COLORS.accent },
                { label: 'Completadas', value: metrics.inscripcionesCompletadas, color: COLORS.success },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ color: COLORS.textSecondary, fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 22, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Inscritos por categoría</h3>
            </div>
            <div className="card-body">
              <BarChart data={metrics.categorias.filter((c) => c.totalInscritos > 0)} valueKey="totalInscritos" labelKey="nombre" color={COLORS.success} />
            </div>
          </div>
        </div>
      )}

      {tab === 'categorias' && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Detalle por categoría</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cursos</th>
                <th>Inscritos</th>
              </tr>
            </thead>
            <tbody>
              {metrics.categorias.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>
                    {c.nombre}
                  </td>
                  <td>{c.totalCursos}</td>
                  <td>{c.totalInscritos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
