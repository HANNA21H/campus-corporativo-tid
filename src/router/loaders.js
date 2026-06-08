import { redirect } from 'react-router-dom';
import { tidApi } from '../services/tid.js';

export function indexRedirectLoader() {
  const session = tidApi.getSession();
  throw redirect(session ? '/dashboard' : '/auth');
}

export function requireAnonLoader() {
  const session = tidApi.getSession();
  if (session) throw redirect('/dashboard');
  return null;
}

export function requireSessionLoader() {
  const session = tidApi.getSession();
  if (!session) throw redirect('/auth');
  return { session };
}

export async function dashboardLoader() {
  await requireSessionLoader();
  return { metrics: await tidApi.getDashboardMetrics() };
}

export async function courseCatalogLoader() {
  const { session } = requireSessionLoader();
  const [cursos, categorias, inscripciones] = await Promise.all([
    tidApi.getCursos(),
    tidApi.getCategorias(),
    tidApi.getInscripciones(session.id),
  ]);
  return { cursos, categorias, inscripciones };
}

export async function registrationManagementLoader() {
  const { session } = requireSessionLoader();
  const [cursos, inscripciones] = await Promise.all([tidApi.getCursos(), tidApi.getInscripciones(session.id)]);
  return { cursos, inscripciones };
}

export async function attendanceAssessmentsLoader() {
  const { session } = requireSessionLoader();
  const [cursos, calificaciones, asistencias] = await Promise.all([
    tidApi.getCursos(),
    tidApi.getCalificaciones(session.id),
    tidApi.getAsistencias(session.id),
  ]);
  return { cursos, calificaciones, asistencias };
}

export async function internalComunicationsLoader() {
  requireSessionLoader();
  return { anuncios: await tidApi.getAnuncios() };
}
