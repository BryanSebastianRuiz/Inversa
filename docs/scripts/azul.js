// Función para actualizar los puntajes del equipo
function actualizarPuntaje(equipo, puntos) {
  // Obtener los puntajes actuales de todos los equipos
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {
    'Rojo': 0,
    'Morado': 0,
    'Azul': 0
  };

  // Sumar los puntos al equipo correspondiente
  puntajes[equipo] += puntos;

  // Guardar los puntajes actualizados en localStorage
  localStorage.setItem('puntajes', JSON.stringify(puntajes));

  // Actualizar la tabla de puntajes
  actualizarTabla(puntajes);
}

// Función para actualizar la tabla de puntajes en la página
function actualizarTabla(puntajes) {
  const tabla = document.getElementById('tabla-puntajes');
  tabla.innerHTML = `
    <tr>
      <th>Equipo</th>
      <th>Puntaje</th>
    </tr>
    <tr>
      <td>Rojo</td>
      <td>${puntajes['Rojo']}</td>
    </tr>
    <tr>
      <td>Morado</td>
      <td>${puntajes['Morado']}</td>
    </tr>
    <tr>
      <td>Azul</td>
      <td>${puntajes['Azul']}</td>
    </tr>
  `;
}

// Función para verificar las flags
document.getElementById('btn-flag1').addEventListener('click', function() {
  var userFlag = document.getElementById('flag1').value.trim();
  var resultadoSpan = document.getElementById('flag1-resultado');

  // Las banderas correctas definidas para todos los equipos
  const correctFlags = {
    1: 'flag{crackme_success}',
    2: 'flag{malware_behavior_captured}',
    3: 'flag{traffic_get_detected}',
    4: 'flag{hidden_in_pixels}',
    5: 'flag{firmware_extracted_successfully}'
  };

  // Verificación de la bandera
  if (userFlag === correctFlags[1]) {
    resultadoSpan.innerHTML = "✅ ¡Flag Correcta! ✅";
    resultadoSpan.style.color = "green";
    // Aquí asignas el puntaje al equipo correspondiente. Por ejemplo, si es el equipo "Rojo"
    actualizarPuntaje('Rojo', 10);  // Asignar puntos al equipo rojo
  } else {
    resultadoSpan.innerHTML = "❌ Flag Incorrecta. Intenta de nuevo ❌";
    resultadoSpan.style.color = "red";
  }
});

// Repetir el proceso para las demás banderas (2, 3, 4, 5) con la misma lógica.

