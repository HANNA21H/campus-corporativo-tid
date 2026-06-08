import React from 'react';
import { useLoaderData, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { EmptyState, FormField, Modal, Spinner } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { confirm, toast } from '../../helpers/alerts.js';
import { tidApi } from '../../services/tid.js';
import { Megaphone, Plus, RefreshCw, Trash2 } from 'lucide-react';

export default function InternalComunicationsPage() {
  const revalidator = useRevalidator();
  const { session } = useRouteLoaderData('root');
  const { anuncios } = useLoaderData();

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ titulo: '', contenido: '', prioridad: 'Media' });
  const [saving, setSaving] = React.useState(false);

  const openCreate = () => {
    setForm({ titulo: '', contenido: '', prioridad: 'Media' });
    setOpen(true);
  };

  const handleCreate = async () => {
    if (!form.titulo || !form.contenido) {
      toast.warning('Completa título y contenido', 'Campos requeridos');
      return;
    }
    setSaving(true);
    try {
      await tidApi.createAnuncio({
        titulo: form.titulo,
        contenido: form.contenido,
        prioridad: form.prioridad,
        autor: session.rol,
        fecha: new Date().toISOString().split('T')[0],
      });
      toast.success('Anuncio creado');
      setOpen(false);
      revalidator.revalidate();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a) => {
    const ok = await confirm({
      title: 'Eliminar anuncio',
      message: a.titulo,
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      color: COLORS.danger,
    });
    if (!ok) return;
    await tidApi.deleteAnuncio(a.id);
    toast.success('Anuncio eliminado');
    revalidator.revalidate();
  };

  if (revalidator.state !== 'idle') return <Spinner text="Actualizando..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h2>Comunicaciones internas</h2>
          <p>Últimos anuncios</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => revalidator.revalidate()} disabled={revalidator.state !== 'idle'}>
            <RefreshCw size={16} /> Actualizar
          </button>
          {session?.rol === 'Admin' && (
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Nuevo
            </button>
          )}
        </div>
      </div>

      {!anuncios?.length ? (
        <EmptyState icon={<Megaphone size={44} color={COLORS.textMuted} />} title="Sin anuncios" subtitle="Aún no hay comunicaciones publicadas" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {anuncios.map((a) => (
            <div key={a.id} className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 15 }}>{a.titulo}</h3>
                  <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>{a.fecha}</span>
                    <span>{a.autor}</span>
                    <span className={`badge ${a.prioridad === 'Alta' ? 'badge-red' : a.prioridad === 'Media' ? 'badge-yellow' : 'badge-gray'}`}>{a.prioridad}</span>
                  </div>
                </div>
                {session?.rol === 'Admin' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a)} style={{ padding: '6px 10px' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="card-body">
                <p style={{ color: COLORS.textSecondary, lineHeight: 1.7 }}>{a.contenido}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo anuncio"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner" style={{ width: 14, height: 14 }}></div> Guardando...
                </>
              ) : (
                'Publicar'
              )}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Título">
            <input className="form-input" value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} />
          </FormField>
          <FormField label="Prioridad">
            <select className="form-input" value={form.prioridad} onChange={(e) => setForm((p) => ({ ...p, prioridad: e.target.value }))}>
              {['Baja', 'Media', 'Alta'].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Contenido">
            <textarea className="form-input" rows={5} value={form.contenido} onChange={(e) => setForm((p) => ({ ...p, contenido: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}

