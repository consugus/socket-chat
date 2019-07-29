const { io } = require('../server');
const { Users } = require('../classes/User');
const { crearMensaje } = require("../utils/utilidades");

let usuarios = new Users();

io.on('connection', (client) => {

    client.on("entrarAlChat", (data, callback) => {

        if( !data.nombre || !data.sala){
            return callback({
                ok: false,
                message: "No llegó el nombre del usuario o la sala"
            });
        }

        client.join(data.sala);

        console.log("Usuario conectado: ", data.nombre, "\tsala: ", data.sala );
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit("listaPersonas", usuarios.getPersonasByRoom(data.sala));
        callback(usuarios.getPersonasByRoom(data.sala));
    });

    client.on("crearMensaje",  (data) => {
        let addressee = usuarios.getPersonaById(client.id);

        let mensaje = crearMensaje( addressee.nombre, data.mensaje );
        client.broadcast.to(addressee.sala).emit("crearMensaje", mensaje);
    });

    client.on("disconnect", () => {
        let personaBorrada = usuarios.deletePersonaById(client.id);

        client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje("Administrador", `${personaBorrada} salió`));
        client.broadcast.to(personaBorrada.sala).emit("listaPersonas", usuarios.getPersonasByRoom(personaBorrada.sala));
    });


    // Mensaje Privado
    client.on("mensajePrivado", (data) => {
        // console.log(data);
        let sender = usuarios.getPersonaById(client.id);
        client.broadcast.to(data.addressee).emit("mensajePrivado", crearMensaje(sender.nombre, data.mensaje));
    });


});