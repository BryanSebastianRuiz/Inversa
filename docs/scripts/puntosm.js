// ========================
// CONFIGURACIÓN DEL EQUIPO
// ========================
const EQUIPO = 'Morado'; // Cambia esto por 'Azul' o 'Morado' según el equipo

// ========================
// FLAGS CORRECTAS
// ========================
const correctFlags = {
  1: 'flag{crackme_success}',
  2: 'flag{malware_behavior_captured}',
  3: 'flag{traffic_get_detected}',
  4: 'flag{hidden_in_pixels}',
  5: 'flag{firmware_extracted_successfully}'
};

// ========================
// FUNCIÓN PARA ACTUALIZAR PUNTAJE
// ========================
function actualizarPuntaje(flagId) {
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {
      'Rojo': 0,
      'Morado': 0,
      'Azul': 0
  };

  const puntos = flagId * 10;
  puntajes[EQUIPO] += puntos;

  localStorage.setItem('puntajes', JSON.stringify(puntajes));
  actualizarTabla(puntajes);
}

// ========================
// ACTUALIZAR TABLA
// ========================
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

// ========================
// ESCUCHADORES POR FLAG
// ========================
for (let i = 1; i <= 5; i++) {
  const btn = document.getElementById(`btn-flag${i}`);
  const input = document.getElementById(`flag${i}`);
  const resultado = document.getElementById(`flag${i}-resultado`);

  if (btn && input && resultado) {
    btn.addEventListener('click', function () {
      const userFlag = input.value.trim();
      if (userFlag === correctFlags[i]) {
        resultado.innerHTML = "✅ ¡Flag Correcta! ✅";
        resultado.style.color = "green";
        actualizarPuntaje(i);
      } else {
        resultado.innerHTML = "❌ Flag Incorrecta. Intenta de nuevo ❌";
        resultado.style.color = "red";
      }
    });
  }
}

// ========================
// SINCRONIZAR TABLA ENTRE PÁGINAS
// ========================
window.addEventListener('storage', function(event) {
  if (event.key === 'puntajes') {
      const puntajes = JSON.parse(event.newValue);
      actualizarTabla(puntajes);
  }
});

// ========================
// MOSTRAR TABLA AL CARGAR
// ========================
document.addEventListener('DOMContentLoaded', function() {
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {
      'Rojo': 0,
      'Morado': 0,
      'Azul': 0
  };
  actualizarTabla(puntajes);
});
