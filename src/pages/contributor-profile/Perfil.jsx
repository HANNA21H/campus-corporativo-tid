import React from "react";

export function Perfil({ nombre, edad, bio }) {
  return (<div>
    <h1>Perfil del Contribuidor</h1>
    <p><strong>Nombre:</strong> {nombre}</p>
    <p><strong>Edad:</strong> {edad} años</p>
    <p><strong>Biografía:</strong> {bio}</p>
  </div>
  );
}

