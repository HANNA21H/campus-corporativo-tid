import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Perfil from '../pages/contributor-profile/Perfil';
import EditarPerfil from '../pages/contributor-profile/EditarPerfil';
import Seguridad from '../pages/contributor-profile/Seguridad';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Perfil nombre="jhon" edad={20} bio="Desarrollador backend" />,
  },
  {
    path: '/perfil',
    element: <Perfil nombre="Juan" edad={30} bio="Desarrollador full-stack" />,
  },
  {
    path: '/editar-perfil',
    element: <EditarPerfil />,
  },
  {
    path: '/seguridad',
    element: <Seguridad />,
  },
]);
