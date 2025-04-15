// scripts/firebase-init.js

// Este script SÓLO inicializa Firebase.
// Debe cargarse DESPUÉS de config.js y los SDKs de Firebase,
// y ANTES de cualquier script que use firebase.database() (equipo.js, tabla.js, scoreboard.js)

if (typeof firebase === 'undefined') {
    console.error("Firebase SDK no cargado antes de firebase-init.js");
} else if (typeof firebaseConfig === 'undefined') {
    console.error("firebaseConfig no definido antes de firebase-init.js (¿config.js cargado?)");
} else {
    // Inicializar la aplicación Firebase por defecto
    // Firebase maneja internamente para no inicializarla múltiples veces si ya existe.
    if (!firebase.apps.length) {
         firebase.initializeApp(firebaseConfig);
         console.log("Firebase App inicializada.");
    } else {
         console.log("Firebase App ya estaba inicializada.");
         // Opcionalmente, obtener la app por defecto si se necesita explícitamente
         // firebase.app();
    }
}