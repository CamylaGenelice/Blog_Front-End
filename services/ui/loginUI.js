import { registrationUser, loginUser } from "../api/auth.js";
import { exibirMensagem,setLoading } from "./DOM_Elements/elements_registration.js";

const loginForm = document.getElementById('loginForm')
const submitButton = loginForm.querySelector('button[type="submit"]');
const buttonOriginalText = submitButton.innerHTML;

loginForm.addEventListener('submit', async(event) =>{
    event.preventDefault()

    submitButton.disabled = true;
        submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Entrando... `;

    try {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        const resposta = await loginUser(username,password)

        if (resposta.type == 'success'){
            
            setTimeout(() => {
                window.location.href = '/html/home.html'
            },2000)
        }
        else{
            submitButton.disabled = false;
            submitButton.innerHTML = buttonOriginalText;
            exibirMensagem('Não foi possivel realizar o login.', 'erro')
        }
    } 
    catch (error) {
        console.error('Erro no login: ',error)
        submitButton.disabled = false;
        submitButton.innerHTML = buttonOriginalText;
        exibirMensagem('Erro ao conectar com o servidor.', 'erro');
    }
    
})



