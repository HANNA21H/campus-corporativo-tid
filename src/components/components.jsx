import { levelBadge } from './badges.js';
import { COLORS, compStyles } from './theme.js';
import { BookOpen, Clock, User, X } from 'lucide-react';

export const GlobalStyles = () => <style>{compStyles}</style>;

export const Spinner = ({ text = 'Cargando...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0', justifyContent: 'center', color: COLORS.textSecondary }}>
    <div className="spinner"></div>
    <span>{text}</span>
  </div>
);

export const EmptyState = ({ icon = null, title = 'Sin resultados', subtitle }) => (
  <div className="empty-state">
    {icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{icon}</div>}
    <p style={{ marginTop: 12, fontWeight: 600, color: COLORS.textSecondary }}>{title}</p>
    {subtitle && <p style={{ fontSize: 13, marginTop: 6 }}>{subtitle}</p>}
  </div>
);

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px 8px', lineHeight: 1 }}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const FormField = ({ label, error, children }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    {children}
    {error && <span className="form-error">{error}</span>}
  </div>
);

export const CourseCard = ({ curso, categorias = [], onEnroll, onDetail, inscrito = false, progress = null }) => {
  const cat = categorias.find((c) => c.id === curso.categoria_id);
  const pct = Math.round((curso.inscritos / curso.max) * 100);
  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ height: 120, background: `linear-gradient(135deg, ${cat?.color || COLORS.accent}22, ${cat?.color || COLORS.accent}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BookOpen size={34} color={COLORS.textSecondary} />
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <span className={`badge ${levelBadge(curso.nivel)}`}>{curso.nivel}</span>
          {cat && <span className="badge badge-gray">{cat.nombre}</span>}
          {inscrito && <span className="badge badge-green">Inscrito</span>}
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{curso.titulo}</h4>
        <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{curso.descripcion}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <User size={14} /> {curso.instructor}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> {curso.duracion}
          </span>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
            <span>
              {curso.inscritos}/{curso.max} inscritos
            </span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: pct + '%', background: pct >= 90 ? COLORS.danger : COLORS.accent }}></div>
          </div>
        </div>
        {progress !== null && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
              <span>Tu progreso</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: progress + '%', background: COLORS.success }}></div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onDetail && onDetail(curso)}
          >
            Ver detalle
          </button>
          {!inscrito && onEnroll && (
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onEnroll(curso)}>
              Inscribirme
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProgressRing = ({ value = 0, size = 80, stroke = 7, color = COLORS.accent }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset .6s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: COLORS.textPrimary, fontSize: size * 0.2 + 'px', fontWeight: 700, fontFamily: 'DM Sans' }}
      >
        {value}%
      </text>
    </svg>
  );
};
