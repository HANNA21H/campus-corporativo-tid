import { NavLink, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { COLORS } from '../theme.js';
import { tidApi } from '../../services/tid.js';
import { BookOpen, LayoutDashboard, ClipboardList, CheckSquare, Megaphone, User, LogOut, GraduationCap } from 'lucide-react';

export default function RootLayout() {
  const { session } = useLoaderData();
  const navigate = useNavigate();

  const logout = () => {
    tidApi.logout();
    navigate('/auth', { replace: true });
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
    background: isActive ? COLORS.surface2 : 'transparent',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 13,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: COLORS.bg }}>
      <aside style={{ background: COLORS.sidebar, borderRight: `1px solid ${COLORS.border}`, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '8px 8px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontFamily: 'DM Sans', fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px' }}>Campus TID</span>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{session.rol}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NavLink to="/dashboard" style={linkStyle}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/course-catalog" style={linkStyle}>
            <BookOpen size={16} /> Cursos
          </NavLink>
          <NavLink to="/registration-management" style={linkStyle}>
            <ClipboardList size={16} /> Inscripciones
          </NavLink>
          <NavLink to="/attendance-assessments" style={linkStyle}>
            <CheckSquare size={16} /> Asistencia
          </NavLink>
          <NavLink to="/internal-comunications" style={linkStyle}>
            <Megaphone size={16} /> Comunicaciones
          </NavLink>
          <NavLink to="/contributor-profile" style={linkStyle}>
            <User size={16} /> Perfil
          </NavLink>
        </nav>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 }}>
            {session.nombre}
            <div style={{ color: COLORS.textMuted, fontWeight: 500 }}>{session.email}</div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={{ padding: 22 }}>
        <Outlet />
      </main>
    </div>
  );
}
