const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const {ChatMensajes}= require('../models');

const chatMensajes=new ChatMensajes();

const socketController= async(socket = new Socket(), io) =>{ //io es todo el servidor de sockets incluyendo la persona que se acaba de conectar
    //el token que se ve en el front application lo devuelve al back
    //recibimos el token cuando el cliente se conecta
    const usuario = await comprobarJWT  (socket.handshake.headers['x-token'])  ;//Validación de JWT
    if (!usuario){
        return socket.disconnect();
    }
    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos',chatMensajes.usuariosArr )//emitamos todos los usuarios que acaban de conectarse en nuestro getter
    socket.emit ('recibir-mensajes', chatMensajes.ultimos10); //último usuario en conectarse se le muestra los últimos 10 mensajes 

    //Conectarlo a una sala especial
    socket.join(usuario.id);//socket se conecta a esta sala: 3salas= global, socket.id, socket.usuario

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos',chatMensajes.usuariosArr )

    })

    socket.on('enviar-mensaje', ({uid,mensaje})=>{
        
        if(uid){
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre,mensaje})
        }else{//Mensaje para todos
            
            chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
        
    })



  //  console.log('Se conectó', usuario.nombre);
}

module.exports={
    socketController
}