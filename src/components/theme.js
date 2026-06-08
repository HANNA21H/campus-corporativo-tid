export const COLORS = {
  bg: '#f8fafc',
  sidebar: '#ffffff',
  surface: '#ffffff',
  surface2: '#f1f5f9',
  border: '#e2e8f0',
  accent: '#2563eb',
  accentHover: '#1d4ed8',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
};

export const compStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: ${COLORS.bg};
    --sidebar: ${COLORS.sidebar};
    --surface: ${COLORS.surface};
    --surface2: ${COLORS.surface2};
    --border: ${COLORS.border};
    --accent: ${COLORS.accent};
    --accent-hover: ${COLORS.accentHover};
    --success: ${COLORS.success};
    --warning: ${COLORS.warning};
    --danger: ${COLORS.danger};
    --text-primary: ${COLORS.textPrimary};
    --text-secondary: ${COLORS.textSecondary};
    --text-muted: ${COLORS.textMuted};
  }
  body { background: var(--bg); color: var(--text-primary); font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; }
  h1,h2,h3,h4,h5 { font-family: 'DM Sans', sans-serif; }
  input, textarea, select { font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px;
    border: none; border-radius: 7px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all .15s; white-space: nowrap; font-family: 'Inter', sans-serif;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-primary  { background: var(--accent); color: #fff; }
  .btn-primary:hover:not(:disabled)  { background: var(--accent-hover); }
  .btn-secondary{ background: var(--surface2); color: var(--text-primary); border: 1px solid var(--border); }
  .btn-secondary:hover:not(:disabled){ background: #e8eef7; }
  .btn-danger   { background: var(--danger); color: #fff; }
  .btn-danger:hover:not(:disabled)   { opacity: 0.85; }
  .btn-ghost    { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover:not(:disabled)    { background: var(--surface2); color: var(--text-primary); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
  .form-input {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 7px;
    color: var(--text-primary); padding: 10px 14px; font-size: 14px; width: 100%;
    transition: border-color .15s;
  }
  .form-input:focus { outline: none; border-color: var(--accent); }
  .form-input.error { border-color: var(--danger); }
  .form-input.valid { border-color: var(--success); }
  .form-error { font-size: 12px; color: var(--danger); }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden;
  }
  .card-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
  .card-body   { padding: 20px 24px; }
  .badge {
    display: inline-flex; align-items: center; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .4px;
  }
  .badge-blue    { background: rgba(37, 99, 235, 0.12); color: #1d4ed8; }
  .badge-green   { background: rgba(22, 163, 74, 0.12); color: #15803d; }
  .badge-red     { background: rgba(220, 38, 38, 0.12);  color: #b91c1c; }
  .badge-yellow  { background: rgba(217, 119, 6, 0.12);  color: #b45309; }
  .badge-purple  { background: rgba(147, 51, 234, 0.12); color: #7e22ce; }
  .badge-gray    { background: rgba(15, 23, 42, 0.06);  color: var(--text-secondary); }
  .table { width: 100%; border-collapse: collapse; }
  .table th { padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
  .table td { padding: 13px 16px; border-bottom: 1px solid #edf2f7; font-size: 13px; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: var(--surface2); }
  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(100,116,139,0.25); border-top-color: var(--accent); border-radius: 50%; animation: spin .6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-size: 26px; font-weight: 700; letter-spacing: -.3px; }
  .page-header p { color: var(--text-secondary); margin-top: 4px; font-size: 14px; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-state svg { margin-bottom: 16px; opacity: 0.4; }
  .empty-state p { font-size: 15px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,.35); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .progress-bar-bg { background: var(--surface2); border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; background: var(--accent); transition: width .4s; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 900px) { .grid-3 { grid-template-columns: repeat(2,1fr); } .grid-4 { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
  .tabs { display: flex; gap: 2px; background: var(--surface2); border-radius: 9px; padding: 4px; width: fit-content; }
  .tab-btn { padding: 8px 18px; border: none; background: transparent; color: var(--text-secondary); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all .15s; }
  .tab-btn.active { background: var(--surface); color: var(--text-primary); box-shadow: 0 1px 4px rgba(0,0,0,.3); }
  .tab-btn:hover:not(.active) { color: var(--text-primary); }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 6px; }
  .stat-value { font-family: 'DM Sans', sans-serif; font-size: 32px; font-weight: 700; }
  .stat-label { font-size: 13px; color: var(--text-secondary); }
  .search-box { display: flex; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0 14px; gap: 8px; transition: border-color .15s; }
  .search-box:focus-within { border-color: var(--accent); }
  .search-box input { background: transparent; border: none; color: var(--text-primary); font-size: 14px; padding: 10px 0; flex: 1; outline: none; }
  .tag { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all .15s; }
  .tag-active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .tag-inactive { background: var(--surface2); color: var(--text-secondary); border-color: var(--border); }
  .tag-inactive:hover { border-color: var(--accent); color: var(--text-primary); }
`;
