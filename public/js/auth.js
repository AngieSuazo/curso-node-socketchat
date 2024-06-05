

const url=(window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://curso-node-restserver-production-cce7.up.railway.app';


const miFormulario=document.querySelector('form');

miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();//evita hacer refresh del navegador 
    const formData={};//data que quiero mandarle al servidor
    for (let el of miFormulario.elements){ //leer todos los cap que tiene el formulario el=elemento
        if(el.name.length > 0) //nombre es mayr a 
            formData[el.name]=el.value
    }
    fetch (url + 'login', {
        method: 'POST',
        body:JSON.stringify(formData),
        headers:{ "Content-Type":"application/json"}
    })
    .then(resp=>resp.json())
    .then(({msg,token})=>{
        if(msg){
            return console.error(msg);
        }
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch(err=>{
        console.log(err);
    })

});


function handleCredentialResponse(response) {
    // Google token :ID_TOKEN
    //console.log('id_token',response.credential);
     const body ={id_token: response.credential};//credenciales que regresan de google
    fetch (url + 'google',{  //no regresa body, regresa readable streams, fetch normalmente es GET 
             method: 'POST',
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify(body)  //serializado
    })
    .then(resp => resp.json())//promesa
    .then( ({token})  =>{ //otra promesa
    // console.log(token); //respuesta que back va a regresar
     localStorage.setItem('token',token);//guardamos el token
     window.location = 'chat.html';
    })
    .catch(console.log);
 }

 const button =document.getElementById('google_signout');

 button.onclick=async()=>{
     console.log(google.accounts.id)
     google.accounts.id.disableAutoSelect()

     google.accounts.id.revoke(localStorage.getItem('email'), done =>{
         localStorage.clear();
         location.reload();
     });
 }
