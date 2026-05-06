const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000',  // Altere para a URL do seu backend
    POST_ID_TO_DISPLAY: 4,                  // ID do post que será exibido na home
    MAX_RECENT_POSTS: 5, 
}

let userCache = null
let authInitialized = false

export async function initAuth() {
    if(authInitialized) return userCache

    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        });

        if(!res.ok){
            userCache = null
        }
        else{
            userCache = await res.json();
            console.log(userCache)
        }
    } 
    catch (error) {
        userCache = null;
        console.error('Erro na função initAuth: ',error)
    }
    authInitialized = true;
    return userCache;
}

export async function loginUser(username, password) {
    try {

       const formData = new URLSearchParams();
       formData.append('grant_type', 'password');
       formData.append('username', username);
       formData.append('password', password);

        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData, 
            credentials: 'include',
            
         })
            

        if (!resposta.ok){
            const erro = await resposta.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }

        

        return {'message':'Login realizado com sucesso', 'type': 'success'}
    
    }   
    
    catch (error) {
        throw error;
    }
   
}

export async function registrationUser(nome,email,senha) {
    try {
        const payload = {
            nome, email, senha
        }
        
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/auth/cadastro`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload), 
            credentials: 'include'
         })

         if(!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
         }
         return {'message':'Usuario criado com sucesso', type: 'success'}
    } 
    catch (error) {
        console.error('Catch: ',error)
        throw error
    }
}

// Função para verificar se o usuário está autenticado
export async function checkAuthStatus() {
    
   if(!authInitialized){
    await initAuth()
   }
   return userCache
    
}

// *Função que roda assim que o site carrega, pegando as informações do usuario. Vai servir para personalizar os botões do site, se estiver logado pode fazer comentarios, se não estiver não aparece a opção
export async function fetchUserProfile() {
    try {
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })

        if (resposta.ok){
            const userData = await resposta.json()
            userCache = userData
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
    if (!userCache){
        return false
    }
    return userCache.role_id === 2
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

