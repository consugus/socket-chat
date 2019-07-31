// Referencias de jQuery
var divUsuarios = $("#divUsuarios");
var formEnviar = $('#formEnviar');
var txtMessage = $('#txtMessage');

// Funciones para renderizar usuarios
var params = new URLSearchParams (window.location.search);
var nombre = params.get("usuario");
var sala = params.get("sala");
var divChatBox = $("#divChatbox");

function renderUsers(users){
    console.log(users);

    var html = '';

    html += ' <li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get("sala") +'</span></a>';
    html += '</li>';

    for(var i = 0; i < users.length; i++){
        html += '<li>';
        html += '    <a data-id="' + users[i].id + '"href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].nombre +'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
};

function renderMessages(message, yo){
    let fecha = new Date(message.fecha);
    let hora = fecha.getHours() + ":" + fecha.getMinutes();
    let adminClass = "info";

    if(message.nombre === "Administrador"){
        adminClass = "danger";
    };
    let html = '';

    if (yo) {
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>' + message.nombre + '</h5>'
        html += '        <div class="box bg-light-inverse">' + message.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else {
        html += '<li class="animated fadeIn">'
        if(message.nombre !== "Administrador"){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        };
        html += '        <div class="chat-content">'
        html += '            <h5>' + message.nombre + '</h5>'
        html += '            <div class="box bg-light-' + adminClass + '">' + message.mensaje + '</div>'
        html += '        </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    }

    divChatBox.append(html);
}


function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// listeners
divUsuarios.on("click", "a", function(){
    var id = $(this).data("id");    // lo que va dentro de los paréntesis de data() es lo que sigue a continuación del guión
                                    // en el elemento anchor, más arriba: data-id: "users[i].id". De esa manera tomamos el valor
                                    // que sigue a continuación

    if(id){
        console.log('id: ', id);
    }
});

formEnviar.on('submit', function(event){
    event.preventDefault();
    if(txtMessage.val().trim().length === 0){
        return;
    };

    socket.emit("crearMensaje", { nombre: nombre, mensaje: txtMessage.val(),
    }, function(mensaje){
        txtMessage.val("").focus();
        renderMessages(mensaje, true);
        scrollBottom();
    })
});
