// scripts/tabla.js

// Asegurarse de que Firebase esté inicializado
if (typeof firebase === 'undefined' || typeof firebase.app !== 'function' || !firebase.apps.length) {
  console.error("¡ERROR CRÍTICO! Firebase no inicializado antes de tabla.js. Revisa el orden de los scripts.");
} else {

  const db = firebase.database(); // Obtener referencia, la inicialización ya ocurrió

  function actualizarTabla(puntajes) {
      // Selecciona la tabla por ID. Funciona tanto en equipo.html como en scoreboard.html si tienen el mismo ID.
      const tabla = document.getElementById('tabla-puntajes');
      const tablaGlobal = document.getElementById('global-score-table'); // Buscar también la tabla global

      const targetTableBody = tabla ? tabla.tBodies[0] : (tablaGlobal ? tablaGlobal.tBodies[0] : null);

      if (!targetTableBody) {
           // console.warn("No se encontró el cuerpo de la tabla (tbody) con ID 'tabla-puntajes' o 'global-score-table'.");
           return; // No hacer nada si no hay tabla visible en esta página
      }

      // Limpiar tabla actual
      targetTableBody.innerHTML = '';

      // Preparar datos y ordenar (si es necesario, aunque para la tabla pequeña no suele serlo)
      let scoreData = [
          { equipo: 'Rojo', puntaje: puntajes.Rojo || 0 },
          { equipo: 'Morado', puntaje: puntajes.Morado || 0 },
          { equipo: 'Azul', puntaje: puntajes.Azul || 0 }
      ];

      // Si es la tabla global, podríamos querer ordenarla
      if (tablaGlobal) {
           scoreData.sort((a, b) => b.puntaje - a.puntaje);
      } // Para tabla-puntajes (la pequeña en equipo.html), mantenemos el orden fijo.

      // Volver a llenar la tabla
      scoreData.forEach(item => {
          const row = targetTableBody.insertRow();
          const cellEquipo = row.insertCell();
          const cellPuntaje = row.insertCell();

          cellEquipo.textContent = item.equipo;
          cellPuntaje.textContent = item.puntaje;

          // Puedes añadir clases o estilos específicos aquí si es necesario
           // Ejemplo para la tabla específica del equipo:
           if (tabla && document.body.dataset.equipo === item.equipo) {
               // row.style.fontWeight = 'bold'; // Resaltar la fila del equipo actual
           }
      });
  }

  // Escuchar desde Firebase
  function escucharPuntajes() {
      const puntajesRef = db.ref("puntajes");

      puntajesRef.on("value", snapshot => {
          const datos = snapshot.val() || { Rojo: 0, Morado: 0, Azul: 0 };
          console.log("Puntajes recibidos por tabla.js:", datos); // Log para depuración
          actualizarTabla(datos);

          // Si estamos en scoreboard.html, notificar a su script que actualice el fondo
          if (typeof actualizarColorFondoScoreboard === 'function') {
               actualizarColorFondoScoreboard(datos);
          }

      }, error => {
           console.error("Error al escuchar puntajes en tabla.js:", error);
           // Quizás mostrar un mensaje de error en la tabla
           const tabla = document.getElementById('tabla-puntajes');
           if (tabla) tabla.innerHTML = '<tr><td colspan="2" style="color:red;">Error al cargar puntajes</td></tr>';
           const tablaGlobal = document.getElementById('global-score-table');
            if (tablaGlobal) tablaGlobal.innerHTML = '<tr><td colspan="2" style="color:red;">Error al cargar puntajes</td></tr>';
      });
  }

  // Iniciar la escucha cuando el DOM esté listo
  window.addEventListener('DOMContentLoaded', () => {
       console.log("DOM cargado. Iniciando escucha de puntajes desde tabla.js.");
       escucharPuntajes();
  });

} // Fin del bloque 'else' que verifica Firebase