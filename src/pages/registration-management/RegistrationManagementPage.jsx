import React from 'react';
import { useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { EmptyState, Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { confirm, toast } from '../../helpers/alerts.js';
import { tidApi } from '../../services/tid.js';
import { ClipboardList, RefreshCw, Trash2 } from 'lucide-react';

export default function RegistrationManagementPage() {
  const revalidator = useRevalidator();
  const { session } = useRouteLoaderData('root');
  const { cursos, inscripciones } = useLoaderData();

  const cursoById = React.useMemo(() => {
    const m = new Map();
    cursos.forEach((c) => m.set(c.id, c));
    return m;
  }, [cursos]);

  const handleCancel = async (insc) => {
    const curso = cursoById.get(insc.curso_id);
    const ok = await confirm({
      title: 'Cancelar inscripción',
      message: curso ? `Curso: ${curso.titulo}` : '¿Deseas cancelar esta inscripción?',
      okText: 'Cancelar inscripción',
      cancelText: 'Volver',
      color: COLORS.danger,
    });
    if (!ok) return;
    await tidApi.deleteInscripcion(insc.id);
    toast.success('Inscripción cancelada');
    revalidator.revalidate();
  };

  if (revalidator.state !== 'idle') return <Spinner text="Actualizando..." />;

  if (!inscripciones?.length) {
    return <EmptyState icon={<ClipboardList size={44} color={COLORS.textMuted} />} title="Sin inscripciones" subtitle="Aún no tienes inscripciones registradas" />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h2>Inscripciones</h2>
          <p>{session.nombre}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => revalidator.revalidate()} disabled={revalidator.state !== 'idle'}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th style={{ width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((i) => {
              const curso = cursoById.get(i.curso_id);
              return (
                <tr key={i.id}>
                  <td style={{ fontWeight: 700 }}>{curso?.titulo || 'Curso'}</td>
                  <td style={{ color: COLORS.textMuted }}>{i.fecha}</td>
                  <td>
                    <span className={`badge ${i.estado === 'Completado' ? 'badge-green' : 'badge-blue'}`}>{i.estado}</span>
                  </td>
                  <td style={{ minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar-bg" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: (i.progreso || 0) + '%', background: (i.progreso || 0) >= 100 ? COLORS.success : COLORS.accent }}></div>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, minWidth: 36, textAlign: 'right' }}>{i.progreso || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(i)} style={{ padding: '6px 10px' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

