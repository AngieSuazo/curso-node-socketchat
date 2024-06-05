const url=(window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://curso-node-restserver-production-cce7.up.railway.app';


//Validamos si el JWT es correcto
let usuario=null;
let socket=null;

//Referncias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
      localStorage.setItem('token', tokenDB );
      usuario = userDB;
      document.title = usuario.nombre;

    await conectarSocket();
    
}

//función que conecta con nuestro back
const conectarSocket= async()=>{

    socket =io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });


    socket.on('connect', ()=>{
        console.log('Socket online');
    });

    socket.on('disconnect', ()=>{
        console.log('Socket offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);
    
    socket.on('mensaje-privado', (payload)=>{
        console.log('Privado', payload);
    });
    
    
}


//EN la pantallla del chat.html se pueden observar los usuarios conectados 
const dibujarUsuarios=(usuarios =[])=>{
    let usersHTML='';
    usuarios.forEach( ({ nombre,uid})=>{ //cramos un list item que vamos a insertar en ulUsuarios
        usersHTML += `
        <li>    
            <p>
            <h5 class= "text-success"> ${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `
    });
    ulUsuarios.innerHTML=usersHTML;
}

const dibujarMensajes=(mensajes =[])=>{
    let mensajesHTML='';
    mensajes.forEach( ({ nombre,mensaje})=>{ //cramos un list item que vamos a insertar en ulUsuarios
        mensajesHTML += `
        <li>    
            <p>
            <h5 class= "text-primary"> ${nombre}</h5>
            <span >${mensaje}</span>
            </p>
        </li>
        `
    });
    ulMensajes.innerHTML=mensajesHTML;
}


txtMensaje.addEventListener('keyup', ({keyCode})=>{ //keyup :lee cada letra escrita
    
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if(keyCode !== 13){return;} //presiona enter
    if(mensaje.length === 0){return;}

    socket.emit('enviar-mensaje',{mensaje,uid}); //mejor mandar como OBJETO
    txtMensaje.value='';

})


const main =async()=>{
    await validarJWT();
}

main();
//const socket =io();