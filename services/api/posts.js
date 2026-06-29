import {isAdmin, checkAuthStatus, initAuth} from "./auth.js";

const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000',  // Altere para a URL do seu backend
    
}

export async function getPosts() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/post/posts`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok){
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        const posts = await response.json()
        
        return posts

    } catch (error) {
        console.error('Erro ao buscar todos os posts')
        throw error
    }
}

export async function getPostName(nome) {
    try {
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/post/pesquisar_post?titulo_post=${encodeURIComponent(nome)}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            

        })
        if (!resposta.ok){
            const erro = await resposta.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        const dados = await resposta.json()

        return dados

    } 
    catch (error) {
        console.error('Erro: ',error)
    }
}
export async function getPostId(id) {
    try {

        const post_id = id || new URLSearchParams(window.location.search).get('id')

        if (!post_id){
            throw new Error ('ID do post não encontrado.')
        }


        const resposta = await fetch(`${CONFIG.API_BASE_URL}/post/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(id)

        })
        if (!resposta.ok){
            const erro = await resposta.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        const dados = await resposta.json()
        return dados

    } 
    catch (error) {
        console.error('Erro: ',error)
        throw error
    }
}

export async function createPost(titulo, conteudo, imagem) {
    try {
        const admin = await initAuth()
        const role_id = admin?.objeto?.role_id

        if(role_id !== 2 || !role_id){
            throw new Error('Usuario não tem autorização')
        }
        const formData = new FormData()
        formData.append('titulo', titulo)
        formData.append('conteudo', conteudo)
        if(imagem){
            formData.append('imagem', imagem)
        }
        
        
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/criar_post`, {
            method: 'POST',
            body: formData,
            credentials: 'include', 
        });
        // Captura o erro do servidor
        if (!requisicao.ok) {
            const erro = await requisicao.json()
            throw new Error (JSON.stringify(erro));
        }
        const dadosConvertidos = await requisicao.json()
        return dadosConvertidos
    } catch (error) {
        console.error('Erro ao criar post: ', error)
        // Relança o erro para que quem chamou a função saiba que falhou
        throw error
    }
}

export async function editPost(post_id,titulo,texto) {
    try {

        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/${post_id}/editar_post`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',     
            },
            credentials: 'include', 
            body: JSON.stringify({titulo,texto})
        });

        if (!requisicao.ok) {
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        const dadosConvertidos = await requisicao.json()
        return dadosConvertidos
    }
    catch (error) {
        console.error('Erro ao editar post: ',error)
        throw error
    }
}

export async function deletePost(post_id) {
    try {
        
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/${post_id}/deletar_post`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({post_id})
        })
        if (!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        const dadosConvertidos = await requisicao.json()
        return dadosConvertidos
    } 
    catch (error) {
        console.error('Erro ao deletar:', error)
        throw error
    }
}