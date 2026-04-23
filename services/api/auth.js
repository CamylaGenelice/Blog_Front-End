const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',  // Altere para a URL do seu backend
    POST_ID_TO_DISPLAY: 4,                  // ID do post que será exibido na home
    MAX_RECENT_POSTS: 5, 
}

let userCache = null

export async function loginUser(username, password) {
    try {

        const formData = new FormData()
        formData.append('username',username)
        formData.append('password',password)

        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: formData,  // Permite que o navegador receba e armazene o cookie
            credentials: 'include'
         })
            

        if (!resposta.ok){
            const erro = await resposta.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }
        return {'message':'Login realizado com sucesso', 'type': 'success'}
    
    }   
    
    catch (error) {
        console.error('Erro ao fazer login:', error)
        throw error;
    }
}

export async function registrationUser(nome,email,senha) {
    try {
        const formData = new FormData()
        formData.append('nome',nome)
        formData.append('email',email)
        formData.append('senha',senha)
        
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/auth/cadastro`, {
            method: 'POST',
            body: formData,  // Permite que o navegador receba e armazene o cookie
            credentials: 'include'
         })

         if(!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
         }
         return {'message':'Usuario criado com sucesso'}
    } 
    catch (error) {
    
        throw error
    }
}

// Função para verificar se o usuário está autenticado
export async function checkAuthStatus() {
    
    try {
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/me`,{
            credentials: 'include'
        })

        if (resposta.ok){
            userCache = await resposta.json()
            return true
    }
        return false
    }
    catch (error) {
        userCache = null
        return false
    }
    
}

// Função que roda assim que o site carrega, pegando as informações do usuario. Vai servir para personalizar os botões do site, se estiver logado pode fazer comentarios, se não estiver não aparece a opção
export async function fetchUserProfile() {
    try {
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })

        if (resposta.ok){
            const userData = await resposta.json()
            localStorage.setItem('user_info', JSON.stringify(userData))
            return userData
        }
        else{
            localStorage.removeItem('user_info')
            return null
        }
    }
    catch (error) {
        console.error("Falha ao checar sessão", error)
        return null
    }
}

export function isAuthenticated() {
    
}
/**
 * Função auxiliar para verificar se o usuário é um Administrador 
 */
export function isAdmin() {
    if (userCache.role_id !== 2 || !userCache){
        return false
    }
    return true
}

export async function logout(){
   try {
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!resposta.ok){
            const erro = await resposta.json()
            throw new Error(`Erro: ${JSON.stringify(erro)}`)
        }
        return true
    } 
    catch(error){
        console.error('Erro ao fazer logout ',error)
    }
    finally {
        localStorage.clear(); // Limpa infos de UI
        window.location.href = 'home.html';
    }
}

