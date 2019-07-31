var socket = io();

var params = new URLSearchParams(window.location.search);
// console.log(params);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderUsers(resp);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderMessages(mensaje, false);
    scrollBottom();
});

// Escuchar cambios de usuarios cuando uno entra o sale del chat
socket.on('listaPersona', function(personas) {
    renderUsers(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
});