export const levelBadge = (nivel) => {
  const map = { Básico: 'badge-green', Intermedio: 'badge-yellow', Avanzado: 'badge-red' };
  return map[nivel] || 'badge-gray';
};

export const estadoBadge = (estado) => {
  const map = {
    Activo: 'badge-blue',
    Completado: 'badge-green',
    Inactivo: 'badge-gray',
    Presente: 'badge-green',
    Ausente: 'badge-red',
    Tardanza: 'badge-yellow',
    Alta: 'badge-red',
    Media: 'badge-yellow',
    Baja: 'badge-gray',
  };
  return map[estado] || 'badge-gray';
};

