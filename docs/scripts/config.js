// scripts/config.js

// ========================
// CONFIGURACIÓN FIREBASE
// ========================
// ¡IMPORTANTE! Considera seriamente mover la validación de flags y
// la actualización de puntajes a Firebase Cloud Functions para
// no exponer tu apiKey ni las flags correctas en el cliente.
const firebaseConfig = {
    apiKey: "AIzaSyC_5YMZb8a5RQ-zOFqo38gWh7vRAA6hb5E", // Tu API Key real
    authDomain: "pagina-5cd8b6.firebaseapp.com",
    databaseURL: "https://pagina-5cd8b6-default-rtdb.firebaseio.com",
    projectId: "pagina-5cd8b6",
    storageBucket: "pagina-5cd8b6.firebasestorage.app",
    messagingSenderId: "354494427059",
    appId: "1:354494427059:web:0b47b47ddcc638b1f8a5c6",
    measurementId: "G-3Q90SV513J"
};

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

// Puedes añadir otras configuraciones globales aquí si es necesario