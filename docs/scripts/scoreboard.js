// scripts/scoreboard.js

// Asegurarse de que Firebase esté inicializado y config cargado
if (typeof firebase === 'undefined' || typeof firebase.app !== 'function' || !firebase.apps.length) {
    console.error("¡ERROR CRÍTICO! Firebase no inicializado antes de scoreboard.js.");
} else if (typeof firebaseConfig === 'undefined') { // Necesitamos config para los colores
    console.error("¡ERROR CRÍTICO! config.js no cargado antes de scoreboard.js.");
} else {

    // Referencias a elementos del DOM específicos del scoreboard
    const container = document.querySelector('.container');
    const loadingMessage = document.getElementById('loading-message');
    const tableBody = document.querySelector('#global-score-table tbody'); // Referencia al tbody de la tabla global

    // Colores definidos (usando variables CSS)
    const teamBackgroundColors = {
        Rojo: 'var(--color-rojo)',
        Morado: 'var(--color-morado)',
        Azul: 'var(--color-azul)',
        Default: 'var(--color-default)'
    };

    // Función para actualizar el color, llamada por tabla.js cuando llegan nuevos datos
    window.actualizarColorFondoScoreboard = function(scores) {
        if (!container) return; // Salir si no estamos en scoreboard.html

        let scoreData = [
            { equipo: 'Rojo', puntaje: scores.Rojo || 0 },
            { equipo: 'Morado', puntaje: scores.Morado || 0 },
            { equipo: 'Azul', puntaje: scores.Azul || 0 }
        ];

        scoreData.sort((a, b) => b.puntaje - a.puntaje);

        let leaderTeam = null;
        if (scoreData.length > 0 && scoreData[0].puntaje > 0) {
            if (scoreData.length > 1 && scoreData[0].puntaje === scoreData[1].puntaje) {
                // Empate
                leaderTeam = null;
            } else {
                leaderTeam = scoreData[0].equipo;
            }
        }

        const newBgColor = teamBackgroundColors[leaderTeam] || teamBackgroundColors.Default;
        container.style.backgroundColor = newBgColor;
        console.log(`Scoreboard: Color de fondo actualizado a ${newBgColor} (Líder: ${leaderTeam || 'Ninguno/Empate'})`);
    }

    // Ocultar mensaje de carga inicial (tabla.js se encargará de mostrar datos)
     window.addEventListener('DOMContentLoaded', () => {
         if(loadingMessage) loadingMessage.style.display = 'none';
         // La tabla se llenará cuando lleguen los primeros datos de Firebase via tabla.js
     });

     // Opcional: Si quieres que tabla.js NO maneje la tabla aquí,
     // puedes mover la lógica de actualizarTabla y escucharPuntajes aquí
     // y quitar la carga de tabla.js de scoreboard.html.
     // Por ahora, dejamos que tabla.js actualice la tabla también aquí.

} // Fin del bloque 'else' que verifica Firebase