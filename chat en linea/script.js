// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup}
from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import {getDatabase, ref, onValue, update, push,child}
from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyABd77CKSwPguajFlXwsiag4j6a9fSJ7o0",

  authDomain: "chat-con-firebase-3c243.firebaseapp.com",

  projectId: "chat-con-firebase-3c243",

  storageBucket: "chat-con-firebase-3c243.appspot.com",

  messagingSenderId: "1036996055979",

  appId: "1:1036996055979:web:98bfdeecc7b2f09885f8ee",

  measurementId: "G-7XGBECRLT9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Aca incia la programacion para el chat
var usuarioConectado = document.getElementById('usuarioConectado');
var botonIniciar = document.getElementById('botonIniciar');
var botonCerrar = document.getElementById('botonCerrar');
var textomensaje = document.getElementById('textomensaje');
var mensajesChat = document.getElementById('mensajesChat');
var nombreUsuarioConectado = "";

botonIniciar.onclick = async function(){
    var auth = getAuth();
    var provider = new GoogleAuthProvider();
    auth.languageCode="es";
    var response = await signInWithPopup(auth, provider);
    usuarioConectado.innerText = response.user.email;
    botonCerrar.style.display = "block";
    botonIniciar.style.display = "none";
    nombreUsuarioConectado = response.user.email;
    escucharYDibujarMensajes();
}

botonCerrar.onclick = async function (){
var auth = getAuth();
await auth.signOut();
botonCerrar.style.display = "none";
botonIniciar.style.display = "block";
location.reload();
usuarioConectado.innerText = "No conectado";
response.user.email = "";
}

textomensaje.onkeydown = async function(event){
    if (event.key == "Enter"){
        if (nombreUsuarioConectado == ""){
            alert("El usuario debe iniciar sesion");
            return;
        }
        var db = getDatabase();
        var referenciaMensajes = ref(db, 'mensajes');
        var nuevaLlave = push(child(ref(db), 'mensajes')).key;
        var nuevosDatos = {
            [nuevaLlave]: {
                usuario: nombreUsuarioConectado,
                mensaje: textomensaje.value,
                fecha: new Date().toLocaleDateString()
            }
        }
        textomensaje.value = ""
        update(referenciaMensajes, nuevosDatos)
    }
}

function escucharYDibujarMensajes (){
    var db = getDatabase();
    var referenciaamensajes = ref(db, 'mensajes');
    onValue(referenciaamensajes, function(datos){
        var valoresObtenidos = datos.val();
        //console.log(valoresObtenidos);
        mensajesChat.innerHTML = "";
    
        Object.keys(valoresObtenidos).forEach(llave=>{
            var mensajeDescargado = valoresObtenidos[llave];
            var mensaje = "";
            mensaje = "<div class='nombre-usuario'>"+ mensajeDescargado.usuario +"</div>";
            mensaje += "<div class='mensaje-chat'>"+ mensajeDescargado.mensaje +"</div>";
            mensaje += "<div>"+ mensajeDescargado.fecha +"</div><hr/>";
            mensajesChat.innerHTML += mensaje;
                })
    })
}
