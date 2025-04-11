function actualizarPuntaje(flagId) {
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {
      'Rojo': 0,
      'Morado': 0,
      'Azul': 0
  };

  if (flagId === 1) puntajes['Rojo'] += 10;
  else if (flagId === 2) puntajes['Azul'] += 10;
  else if (flagId === 3) puntajes['Morado'] += 10;

  localStorage.setItem('puntajes', JSON.stringify(puntajes));
  actualizarTabla(puntajes);
}

function actualizarTabla(puntajes) {
  const tabla = document.getElementById('tabla-puntajes');
  if (!tabla) return;

  tabla.innerHTML = `
      <tr>
          <th>Equipo</th>
          <th>Puntaje</th>
      </tr>
  `;

  for (let equipo in puntajes) {
      tabla.innerHTML += `
          <tr>
              <td>${equipo}</td>
              <td>${puntajes[equipo]}</td>
          </tr>
      `;
  }
}

window.addEventListener('storage', function(event) {
  if (event.key === 'puntajes') {
      const puntajes = JSON.parse(event.newValue);
      actualizarTabla(puntajes);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const puntajes = JSON.parse(localStorage.getItem('puntajes')) || {
      'Rojo': 0,
      'Morado': 0,
      'Azul': 0
  };
  actualizarTabla(puntajes);
});
