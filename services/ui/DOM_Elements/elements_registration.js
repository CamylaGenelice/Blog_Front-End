
// DOM Elements

const btnCadastrar = document.getElementById('btnCadastrar')
const mensagemDiv = document.getElementById('mensagem')

export function exibirMensagem(texto,tipo) {
    const mensagem = document.getElementById('mensagem')

    if(!mensagem){
        console.warn('Elemento mensagem não encontrado')
        return
    }

  mensagem.textContent = texto
  mensagem.className = tipo === 'erro' ? 'alert alert-danger' : 'alert alert-success'
  mensagem.style.display = 'block'

  setTimeout(() => {
    mensagem.style.display = 'none'
  }, 3000)
}

export function limparFormulario() {
    document.getElementById('nome').value = ''
    document.getElementById('email').value = ''
    document.getElementById('senha').value = ''
    document.getElementById('confirmarSenha').value = ''
}

export function setLoading(isLoading){
    if(isLoading){
        btnCadastrar.disabled = true
        btnCadastrar.innerHTML = '<span class="loading"></span> Cadastrando...'
    }
    else{
         btnCadastrar.disabled = false
        btnCadastrar.innerHTML = 'Cadastrar'
    }
}

export function validarCampos(nome, email, senha, confirmarSenha) {
    
    if (!nome || nome.trim().length < 3) {
        exibirMensagem('Nome deve ter pelo menos 3 caracteres', 'erro')
        return false
    }

    // Valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !emailRegex.test(email)) {
        exibirMensagem('Digite um e-mail válido', 'erro')
        return false
    }

    // Valida senha
    if (!senha || senha.length < 6) {
        exibirMensagem('Senha deve ter pelo menos 6 caracteres', 'erro')
        return false
    }
    
    // Valida confirmação de senha
    if (senha !== confirmarSenha) {
        exibirMensagem('As senhas não conferem', 'erro')
        return false
    }
    
    return true
}