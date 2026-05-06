import { registrationUser, loginUser } from "../api/auth.js";
import { exibirMensagem, validarCampos, limparFormulario, setLoading } from "./DOM_Elements/elements_registration.js";

// Evento de submit do formulário

const formCadastro = document.getElementById('formCadastro')
const senhaInput = document.getElementById('senha')
const confirmarSenhaInput = document.getElementById('confirmarSenha')

if( formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault() // Impede o recarregamento da página

    const nome = document.getElementById('nome').value
    const username = document.getElementById('email').value
    const password = document.getElementById('senha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if(!validarCampos(nome,username,password,confirmarSenha)){
        return
    }
    setLoading(true)

    try {
        const consult = await registrationUser(nome,username,password)

        if(!consult){
            exibirMensagem('Erro ao realizar cadastro, tente novamente!', 'erro')
        }

        exibirMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso')

        const loginResult = await loginUser(username,password)

        if (loginResult.success) {
            
            //Redireciona para o dashboard/página principal
            setTimeout(() => {
                window.location.href = '/home.html'
            }, 1500)
        } 
        else{
            limparFormulario()

            setTimeout(() => {
                window.location.href = '/login.html'
            },1500)
        }

    } 
    catch (error) {
        console.error('Erro detalhado:', error)

        let mensagemErro = 'Erro ao realizar cadastro. Tente novamente.'
        
        // Trata diferentes tipos de erro que podem vir do backend
        if (error.message.includes('email já cadastrado')) {
            mensagemErro = '❌ Este e-mail já está cadastrado. Use outro e-mail ou faça login.'
        } else if (error.message.includes('senha')) {
            mensagemErro = '❌ Senha inválida. A senha deve ter pelo menos 6 caracteres.'
        } else if (error.message.includes('nome')) {
            mensagemErro = '❌ Nome inválido. Digite um nome válido.'
        } else {
            mensagemErro = `❌ Erro: ${error.message}`
        }

        exibirMensagem(mensagemErro, 'erro')
    }
    finally {
        // remove o loading
        setLoading(false)
    }
})
}

if (confirmarSenhaInput && senhaInput){
    
    confirmarSenhaInput.addEventListener('input', () => {
    if(senhaInput.value !== confirmarSenhaInput.value){
        confirmarSenhaInput.style.borderColor = '#dc3545'
    }
    else{
        confirmarSenhaInput.style.borderColor = '#28a745'
    }
})

    senhaInput.addEventListener('input', () => {
    if(senhaInput.value && confirmarSenhaInput.value !== confirmarSenhaInput.value){
        confirmarSenhaInput.style.borderColor = '#dc3545'
    }
    else if (confirmarSenhaInput.value) {
        confirmarSenhaInput.style.borderColor = '#28a745'
    }
})

}

// Evento de submit do login


