// scripts/chat.js 

if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error("Firebase no está inicializado.");
} else {
    const db = firebase.database();
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // Obtener el nickname del localStorage
    const nickname = localStorage.getItem('nickname') || 'Invitado';  // Si no hay nickname, asigna "Invitado"
    const equipo = document.body.dataset.equipo;
    const chatRef = db.ref(`chats/${equipo}`);

    function escapeHTML(texto) {
        return texto.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }
    
    function agregarMensajeAlChat(nombre, mensaje) {
        const p = document.createElement('p');
        const safeNombre = escapeHTML(nombre);
        const safeMensaje = escapeHTML(mensaje);
        p.innerHTML = `<strong>${safeNombre}:</strong> ${safeMensaje}`;
        chatBox.appendChild(p);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    

    // Escuchar mensajes nuevos
    chatRef.on('child_added', snapshot => {
        const data = snapshot.val();
        if (data && data.nombre && data.mensaje) {
            agregarMensajeAlChat(data.nombre, data.mensaje);
        }
    });

    // Enviar mensaje
    chatForm.addEventListener('submit', () => {
        const mensaje = chatInput.value.trim();
        if (mensaje !== '') {
            const nuevoMensaje = {
                nombre: nickname,  // Usar el nickname en lugar del nombre del equipo
                mensaje: mensaje,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            chatRef.push(nuevoMensaje);
            chatInput.value = '';
        }
    });
}
