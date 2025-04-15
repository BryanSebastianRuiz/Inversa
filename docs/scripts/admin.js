// === admin.js ===

// Clave de administrador (cámbiala por algo más fuerte en producción)
const adminKey = "superadmin123";

// Mostrar prompt de clave al hacer login
function loginAdmin() {
  const clave = prompt("Ingresa la clave de administrador:");
  if (clave === adminKey) {
    localStorage.setItem("isAdmin", "true");
    mostrarControlesAdmin();
  } else {
    alert("Clave incorrecta.");
  }
}

// Mostrar controles si el usuario ya está autenticado
function mostrarControlesAdmin() {
  if (localStorage.getItem("isAdmin") === "true") {
    const adminControls = document.getElementById("adminControls");
    if (adminControls) {
      adminControls.style.display = "block";
    }
  }
}

// Ejecutar al cargar la página
window.addEventListener("load", mostrarControlesAdmin);

// === Funciones administrativas ===

function borrarRespuestas() {
  if (!confirm("¿Seguro que deseas borrar TODAS las respuestas del equipo Rojo?")) return;
  const db = firebase.database();
  db.ref("respuestas/Rojo").remove()
    .then(() => alert("✅ Respuestas borradas correctamente."))
    .catch((error) => alert("❌ Error al borrar respuestas: " + error));
}

function reiniciarPuntaje() {
  if (!confirm("¿Reiniciar la puntuación del equipo Rojo a 0?")) return;
  const db = firebase.database();
  db.ref("puntajes/Rojo").set(0)
    .then(() => alert("✅ Puntaje reiniciado."))
    .catch((error) => alert("❌ Error al reiniciar puntaje: " + error));
}
