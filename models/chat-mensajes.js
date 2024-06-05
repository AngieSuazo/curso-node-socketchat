class Mensaje{
    constructor(uid,nombre,mensaje){
        this.uid=uid;
        this.nombre=nombre;
        this.mensaje=mensaje;
    }
}


class ChatMensajes{
    constructor(){
        this.mensajes=[],
        this.usuarios={}
    }

    get ultimos10(){
        this.mensajes=this.mensajes.splice(0,10);//cortar los últimos 10 mensjaes
        return this.mensajes;
    }

    get usuariosArr(){
        return Object.values(this.usuarios); // [ {},{},{},...]
    }

    enviarMensaje(uid,nombre,mensaje){
            this.mensajes.unshift( //insertar al inicio
                new Mensaje(uid,nombre,mensaje)
            );
    }

    conectarUsuario (usuario){
        this.usuarios[usuario.id]=usuario //usuarios es un objeto entonces ponemos como identificador el usuario.id
    }

    desconectarUsuario(id){
        delete this.usuarios[id];
    }
}

module.exports=ChatMensajes;
//Solo exportarmos ChatMensajes porque Mensajes solo funciona en esta clase por lo que puede considerarse como una clase privada