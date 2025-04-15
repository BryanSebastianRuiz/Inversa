// scripts/equipo.js

// Asegurarse de que Firebase esté inicializado y config esté cargado
if (typeof firebase === 'undefined' || typeof firebase.app !== 'function' || !firebase.apps.length) {
    console.error("¡ERROR CRÍTICO! Firebase no inicializado antes de equipo.js. Revisa el orden de los scripts en el HTML.");
} else if (typeof correctFlags === 'undefined') {
     console.error("¡ERROR CRÍTICO! correctFlags no definido (¿config.js cargado antes?).");
} else {

    const db = firebase.database();

    // Obtener el nombre del equipo del atributo 'data-equipo' en el body del HTML
    const equipo = document.body.dataset.equipo;

    if (!equipo) {
        console.error("¡ERROR! No se pudo determinar el equipo. Falta 'data-equipo' en la etiqueta <body> del HTML.");
    } else {
        console.log(`Script cargado para el equipo: ${equipo}`);
    }

    // --- Funciones

    function verificarFlag(numeroFlag) {
        if (!equipo) return; // No hacer nada si no sabemos el equipo

        console.log(`Verificando flag ${numeroFlag} para ${equipo}`); // Log para depuración

        const input = document.getElementById(`flag${numeroFlag}`);
        const resultado = document.getElementById(`flag${numeroFlag}-resultado`);
        const btn = document.getElementById(`btn-flag${numeroFlag}`);

        if (!input || !resultado || !btn) {
            console.error(`Error: No se encontraron los elementos HTML para flag ${numeroFlag}.`);
            return;
        }

        const userFlag = input.value.trim();
        // Accedemos a correctFlags que viene de config.js
        const flagEsperada = correctFlags[numeroFlag];
        const flagEquipoRef = db.ref(`respuestas/${equipo}/flag${numeroFlag}`);

        btn.disabled = true; // Deshabilitar botón mientras se verifica
        resultado.innerText = "Verificando...";
        resultado.style.color = "gray";

        console.log(`Input: '${userFlag}', Esperada: '${flagEsperada}'`);

        flagEquipoRef.once("value").then(snapshot => {
            console.log(`Firebase check para respuestas/${equipo}/flag${numeroFlag}. Respondido:`, snapshot.val());
            if (snapshot.val()) {
                resultado.innerText = "⚠️ Ya respondiste esta bandera.";
                resultado.style.color = "orange";
                // No re-habilitar el botón si ya fue respondida
                return; // Salir de la función .then
            }

            // Si no ha sido respondida, comparar
            if (userFlag === flagEsperada) {
                console.log("¡Flag correcta!");
                resultado.innerText = "✅ ¡Flag Correcta!";
                resultado.style.color = "green";

                const puntajeRef = db.ref(`puntajes/${equipo}`);
                // Incrementar puntaje usando transacción para evitar condiciones de carrera
                return puntajeRef.transaction(puntosActuales => {
                    // Firebase llama a esta función. Si puntosActuales es null (nunca se ha seteado), lo trata como 0.
                    console.log(`Transacción: Puntaje actual para ${equipo}: ${puntosActuales || 0}. Sumando 10.`);
                    return (puntosActuales || 0) + 10;
                }).then(result => {
                    if(result.committed) {
                        console.log("Puntaje actualizado exitosamente via transacción.");
                        // Marcar la flag como respondida SOLO si la transacción fue exitosa
                        return flagEquipoRef.set(true);
                    } else {
                         console.log("Transacción de puntaje no cometida (quizás otro la modificó).");
                         throw new Error("Conflicto al actualizar puntaje"); // Lanzar error para el catch
                    }
                }).then(() => {
                    console.log(`Flag ${numeroFlag} marcada como respondida para ${equipo}.`);
                    // El botón ya está deshabilitado
                });

            } else {
                console.log("Flag incorrecta.");
                resultado.innerText = "❌ Flag Incorrecta. Intenta de nuevo.";
                resultado.style.color = "red";
                btn.disabled = false; // Re-habilitar si fue incorrecta
            }

        }).catch(error => {
            console.error(`Error verificando/actualizando flag ${numeroFlag} para ${equipo}:`, error);
            resultado.innerText = "⚠️ Error en el servidor. Intenta más tarde.";
            resultado.style.color = "red";
            if (!snapshot.val()) { // Solo re-habilitar si el error no fue por "ya respondido"
                 btn.disabled = false;
            }
        });
    }

    function inicializarEventos() {
        if (!equipo) return;
        console.log(`Inicializando listeners para los botones de ${equipo}`);
        for (let i = 1; i <= 5; i++) {
            const btn = document.getElementById(`btn-flag${i}`);
            if (btn) {
                btn.addEventListener("click", () => verificarFlag(i));
                 console.log(`Listener añadido a btn-flag${i}`);
            } else {
                console.warn(`Botón btn-flag${i} no encontrado en el HTML.`);
            }
        }
    }

    function verificarBotonesRespondidos() {
        if (!equipo) return;
        console.log(`Verificando flags ya respondidas por ${equipo}`);
        for (let i = 1; i <= 5; i++) {
            const ref = db.ref(`respuestas/${equipo}/flag${i}`);
            ref.once("value").then(snapshot => {
                if (snapshot.val()) {
                    const btn = document.getElementById(`btn-flag${i}`);
                    if (btn) {
                        btn.disabled = true;
                         console.log(`Botón btn-flag${i} deshabilitado (ya respondido).`);
                         // Opcional: Mostrar mensaje "Ya respondido"
                         const resultado = document.getElementById(`flag${i}-resultado`);
                         if(resultado) {
                             resultado.innerText = "✔️ Respondida";
                             resultado.style.color = "green";
                         }
                    }
                }
            }).catch(error => {
                console.error(`Error al verificar estado del botón para flag ${i}:`, error);
            });
        }
    }

    // Ejecutar al cargar el script (después de que el DOM esté listo sería mejor, pero window.onload funciona)
    window.addEventListener('load', () => {
       console.log(`DOM cargado para ${equipo}. Ejecutando inicialización.`);
       if (equipo) { // Asegurarse de que tenemos equipo antes de proceder
           inicializarEventos();
           verificarBotonesRespondidos();
       } else {
            console.error("No se pudo inicializar la página del equipo por falta de 'data-equipo'.");
       }
    });

} // Fin del bloque 'else' que verifica si Firebase está listo

    // Funciones de administrador
    function esAdmin() {
        return new URLSearchParams(window.location.search).get("admin") === "true";
    }

    function agregarBotonesAdmin() {
        if (!esAdmin()) return;

        console.log("Modo administrador activado.");

        const adminPanel = document.createElement("div");
        adminPanel.style.marginTop = "2em";
        adminPanel.style.padding = "1em";
        adminPanel.style.border = "2px dashed red";
        adminPanel.style.backgroundColor = "#ffecec";
        adminPanel.innerHTML = `
            <h3 style="color:red;">Modo Administrador</h3>
            <button id="resetPuntaje">🔄 Reiniciar Puntaje</button>
            <button id="borrarRespuestas">🗑️ Borrar Respuestas</button>
        `;
        document.body.appendChild(adminPanel);

        document.getElementById("resetPuntaje").addEventListener("click", () => {
            if (confirm("¿Seguro que quieres reiniciar el puntaje?")) {
                db.ref(`puntajes/${equipo}`).remove()
                    .then(() => alert("✅ Puntaje reiniciado"))
                    .catch(err => alert("⚠️ Error al reiniciar puntaje: " + err));
            }
        });

        document.getElementById("borrarRespuestas").addEventListener("click", () => {
            if (confirm("¿Seguro que quieres borrar todas las respuestas del equipo? Esto permitirá reintentar los flags.")) {
                db.ref(`respuestas/${equipo}`).remove()
                    .then(() => {
                        alert("✅ Respuestas borradas");
                        location.reload(); // Recargar para reflejar los botones habilitados
                    })
                    .catch(err => alert("⚠️ Error al borrar respuestas: " + err));
            }
        });
    }

    // Llamar a la función si es admin
    window.addEventListener('load', () => {
        if (esAdmin()) {
            agregarBotonesAdmin();
        }
    });
