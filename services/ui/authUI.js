import { registrationUser, loginUser } from "../api/auth";
import { exibirMensagem, validarCampos, limparFormulario, setLoading } from "./DOM_Elements/elements_registration";

// Evento de submit do formulário

const formCadastro = document.getElementById('formCadastro')
const senhaInput = document.getElementById('senhaCadastro')
const confirmarSenhaInput = document.getElementById('confirmarSenha')


formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault() // Impede o recarregamento da página

    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if(!validarCampos(nome,email,senha,confirmarSenha)){
        return
    }
    setLoading(true)

    try {
        const consult = await registrationUser(nome,email,senha)

        if(!consult){
            exibirMensagem('Erro ao realizar cadastro, tente novamente!', 'erro')
        }

        exibirMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso')

        const loginResult = await loginUser(nome,senha)

        if (loginResult.success) {
            
            // Redireciona para o dashboard/página principal
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

// Evento de submit do login

const formLogin = document.getElementById('formLogin')


formLogin.addEventListener('submit', async(event) =>{
    event.preventDefault()

    try {
        const email = document.getElementById('email').value
        const senha = document.getElementById('senhaLogin').value

        const resposta = await loginUser(email,senha)

        if (resposta.type == 'success'){
            setTimeout(() => {
                window.location.href = '/home.html'
            },1500)
        }
        else{
            exibirMensagem('Não foi possivel realizar o login.', 'erro')
        }
    } 
    catch (error) {
        console.error('Erro no login: ',error)
        exibirMensagem('Erro ao tentar realizar login.','erro')
    }
})

