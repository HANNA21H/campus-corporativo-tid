import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { toast } from '../../helpers/alerts.js';
import { tidApi } from '../../services/tid.js';
import { ArrowLeft, Eye, EyeOff, GraduationCap } from 'lucide-react';

function LoginView({ loading, setLoading, goToRecover, goToRegister, onAuthenticated }) {
  const [form, setForm] = React.useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = React.useState({});
  const [showPass, setShowPass] = React.useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo no válido';
    if (!form.password) e.password = 'La contraseña es requerida';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const session = await tidApi.login(form.email, form.password);
      toast.success(`Hola, ${session.nombre}`, '¡Bienvenido!');
      onAuthenticated();
    } catch (err) {
      toast.error(err?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    className: `form-input ${errors[field] ? 'error' : form[field] ? 'valid' : ''}`,
    value: form[field],
    onChange: (e) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <FormField label="Correo electrónico" error={errors.email}>
        <input type="email" placeholder="usuario@tid.com" {...f('email')} />
      </FormField>
      <FormField label="Contraseña" error={errors.password}>
        <div style={{ position: 'relative' }}>
          <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...f('password')} />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.textMuted,
            }}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormField>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: COLORS.textSecondary, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.remember} onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))} style={{ accentColor: COLORS.accent }} />
          Recordarme
        </label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={goToRecover} style={{ color: COLORS.accent, padding: '4px 0' }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '11px', justifyContent: 'center' }}>
        {loading ? (
          <>
            <div className="spinner" style={{ width: 16, height: 16 }}></div> Verificando...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>
      <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary }}>
        ¿No tienes cuenta?{' '}
        <button type="button" className="btn btn-ghost btn-sm" onClick={goToRegister} style={{ color: COLORS.accent, padding: 0 }}>
          Regístrate aquí
        </button>
      </p>
      <div style={{ background: COLORS.surface2, borderRadius: 8, padding: '12px 16px', fontSize: 12, color: COLORS.textMuted }}>
        <strong style={{ color: COLORS.textSecondary }}>Demo:</strong> carlos@tid.com / 123456
      </div>
    </form>
  );
}

function RegistroView({ loading, setLoading, goToLogin }) {
  const [form, setForm] = React.useState({ nombre: '', email: '', telefono: '', area: '', password: '', confirmar: '' });
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const rules = {
    nombre: (v) => (!v ? 'El nombre es requerido' : v.length < 3 ? 'Mínimo 3 caracteres' : ''),
    email: (v) => (!v ? 'El correo es requerido' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo no válido' : ''),
    telefono: (v) => (v && !/^\d{7,15}$/.test(v.replace(/[-\s]/g, '')) ? 'Teléfono no válido' : ''),
    area: (v) => (!v ? 'El área es requerida' : ''),
    password: (v) => (!v ? 'La contraseña es requerida' : v.length < 6 ? 'Mínimo 6 caracteres' : ''),
    confirmar: (v) => (!v ? 'Confirma tu contraseña' : v !== form.password ? 'Las contraseñas no coinciden' : ''),
  };

  const validate = (field, val) => {
    const err = rules[field]?.(val) || '';
    setErrors((p) => ({ ...p, [field]: err }));
    return err;
  };

  const handleChange = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (touched[field]) validate(field, val);
    if (field === 'password' && touched.confirmar) validate('confirmar', form.confirmar);
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    validate(field, form[field]);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const allTouched = {};
    Object.keys(rules).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    const allErrors = {};
    let hasError = false;
    Object.keys(rules).forEach((k) => {
      const e = rules[k](form[k]);
      if (e) {
        allErrors[k] = e;
        hasError = true;
      }
    });
    setErrors(allErrors);
    if (hasError) return;

    setLoading(true);
    try {
      await tidApi.registro({ nombre: form.nombre, email: form.email, telefono: form.telefono, area: form.area, password: form.password });
      toast.success('Tu cuenta ha sido creada. Inicia sesión.', '¡Registro exitoso!');
      goToLogin();
    } catch (err) {
      toast.error(err?.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, type = 'text', placeholder = '') => ({
    type,
    placeholder,
    className: `form-input ${errors[key] && touched[key] ? 'error' : form[key] && !errors[key] ? 'valid' : ''}`,
    value: form[key],
    onChange: (e) => handleChange(key, e.target.value),
    onBlur: () => handleBlur(key),
  });

  const strengthPct = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s += 25;
    if (p.length >= 10) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9!@#$%]/.test(p)) s += 25;
    return s;
  };
  const sp = strengthPct();
  const strengthColor = sp < 50 ? COLORS.danger : sp < 75 ? COLORS.warning : COLORS.success;
  const strengthLabel = sp < 25 ? 'Muy débil' : sp < 50 ? 'Débil' : sp < 75 ? 'Regular' : sp < 100 ? 'Fuerte' : 'Muy fuerte';

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="grid-2">
        <FormField label="Nombre completo" error={touched.nombre && errors.nombre}>
          <input {...field('nombre', 'text', 'Ej: Ana Gómez')} />
        </FormField>
        <FormField label="Área / Departamento" error={touched.area && errors.area}>
          <select
            {...field('area')}
            style={{
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 7,
              color: !form.area ? COLORS.textMuted : COLORS.textPrimary,
              padding: '10px 14px',
              fontSize: 14,
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <option value="">Seleccionar...</option>
            {['Tecnología', 'RRHH', 'Operaciones', 'Finanzas', 'Legal', 'Marketing'].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Correo electrónico" error={touched.email && errors.email}>
        <input {...field('email', 'email', 'usuario@tid.com')} />
      </FormField>
      <FormField label="Teléfono (opcional)" error={touched.telefono && errors.telefono}>
        <input {...field('telefono', 'tel', '555-0000')} />
      </FormField>
      <FormField label="Contraseña" error={touched.password && errors.password}>
        <input {...field('password', 'password', 'Mínimo 6 caracteres')} />
        {form.password && (
          <div style={{ marginTop: 6 }}>
            <div className="progress-bar-bg" style={{ height: 4 }}>
              <div className="progress-bar-fill" style={{ width: sp + '%', background: strengthColor }}></div>
            </div>
            <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
          </div>
        )}
      </FormField>
      <FormField label="Confirmar contraseña" error={touched.confirmar && errors.confirmar}>
        <input {...field('confirmar', 'password', 'Repite tu contraseña')} />
      </FormField>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '11px', justifyContent: 'center' }}>
        {loading ? (
          <>
            <div className="spinner" style={{ width: 16, height: 16 }}></div> Registrando...
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>
      <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary }}>
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="btn btn-ghost btn-sm" onClick={goToLogin} style={{ color: COLORS.accent, padding: 0 }}>
          Iniciar sesión
        </button>
      </p>
    </form>
  );
}

function RecuperarView({ loading, setLoading, goToLogin }) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!email) {
      setError('El correo es requerido');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Correo no válido');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await tidApi.recuperar(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ fontSize: 56 }}>📧</div>
        <h3 style={{ fontSize: 20, fontWeight: 700 }}>Revisa tu correo</h3>
        <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>
          Si el correo <strong>{email}</strong> está registrado, recibirás instrucciones para restablecer tu contraseña en los próximos minutos.
        </p>
        <button className="btn btn-primary" onClick={goToLogin} style={{ marginTop: 8 }}>
          Volver al inicio de sesión
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>Ingresa tu correo y te enviaremos instrucciones para recuperar tu contraseña.</p>
      <FormField label="Correo electrónico" error={error}>
        <input
          type="email"
          className={`form-input ${error ? 'error' : email ? 'valid' : ''}`}
          placeholder="usuario@tid.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
      </FormField>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '11px', justifyContent: 'center' }}>
        {loading ? (
          <>
            <div className="spinner" style={{ width: 16, height: 16 }}></div> Enviando...
          </>
        ) : (
          'Enviar instrucciones'
        )}
      </button>
      <button type="button" className="btn btn-ghost" onClick={goToLogin} style={{ width: '100%', justifyContent: 'center' }}>
        <ArrowLeft size={16} /> Volver al inicio de sesión
      </button>
    </form>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [view, setView] = React.useState('login');
  const [loading, setLoading] = React.useState(false);

  const titles = { login: 'Iniciar sesión', registro: 'Crear cuenta', recuperar: 'Recuperar contraseña' };
  const subtitles = { login: 'Accede a tu espacio de aprendizaje', registro: 'Únete a Campus Corporativo TID', recuperar: 'Restablece tu acceso' };

  const onAuthenticated = () => navigate('/dashboard', { replace: true });

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: '-0.3px' }}>Campus TID</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{titles[view]}</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>{subtitles[view]}</p>
        </div>

        <div className="card" style={{ padding: '28px 32px' }}>
          {view === 'login' && (
            <LoginView
              loading={loading}
              setLoading={setLoading}
              goToRecover={() => setView('recuperar')}
              goToRegister={() => setView('registro')}
              onAuthenticated={onAuthenticated}
            />
          )}
          {view === 'registro' && <RegistroView loading={loading} setLoading={setLoading} goToLogin={() => setView('login')} />}
          {view === 'recuperar' && <RecuperarView loading={loading} setLoading={setLoading} goToLogin={() => setView('login')} />}
        </div>
      </div>
    </div>
  );
}
