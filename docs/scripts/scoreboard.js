// scripts/scoreboard.js

if (typeof firebase === 'undefined' || typeof firebase.app !== 'function' || !firebase.apps.length) {
    console.error("🔥 ERROR: Firebase no está inicializado.");
} else if (typeof firebaseConfig === 'undefined') {
    console.error("🔥 ERROR: Falta firebaseConfig (¿cargaste config.js?).");
} else {

    const container = document.querySelector('.container');
    const loadingMessage = document.getElementById('loading-message');
    const tableBody = document.querySelector('#global-score-table tbody');

    const teamBackgroundColors = {
        Rojo: 'var(--color-rojo)',
        Morado: 'var(--color-morado)',
        Azul: 'var(--color-azul)',
        Default: 'var(--color-default)'
    };

    window.actualizarColorFondoScoreboard = function(scores) {
        if (!container) return;

        let scoreData = [
            { equipo: 'Rojo', puntaje: scores?.Rojo || 0 },
            { equipo: 'Morado', puntaje: scores?.Morado || 0 },
            { equipo: 'Azul', puntaje: scores?.Azul || 0 }
        ];

        scoreData.sort((a, b) => b.puntaje - a.puntaje);

        let leaderTeam = null;
        if (scoreData.length > 0 && scoreData[0].puntaje > 0) {
            if (scoreData[1] && scoreData[0].puntaje === scoreData[1].puntaje) {
                leaderTeam = null;
            } else {
                leaderTeam = scoreData[0].equipo;
            }
        }

        const newBgColor = teamBackgroundColors[leaderTeam] || teamBackgroundColors.Default;
        container.style.backgroundColor = newBgColor;

        console.log(`🎨 Fondo actualizado: ${leaderTeam || 'Ninguno'} → ${newBgColor}`);
    };

    window.addEventListener('DOMContentLoaded', () => {
        if (loadingMessage) loadingMessage.style.display = 'none';
    });

}
