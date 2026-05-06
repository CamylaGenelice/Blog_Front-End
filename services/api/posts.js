import {isAdmin} from "./auth.js";

const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',  // Altere para a URL do seu backend
    POST_ID_TO_DISPLAY: 4,                  // ID do post que será exibido na home
    MAX_RECENT_POSTS: 5, 
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
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/post/pesquisar_post?titulo=${encodeURIComponent(nome)}`, {
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
        throw error
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

export async function createPost(titulo, conteudo) {
    try {
        const admin = isAdmin()
        if (!admin){
            throw new Error('Admin é false')
        }
        // Faz a requisição para o back-end
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/criar_post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',     
            },
            credentials: 'include', 
            body: JSON.stringify({titulo,conteudo})
        });
        // Captura o erro do servidor
        if (!requisicao.ok) {
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        const dadosConvertidos = await requisicao.json()
        return dadosConvertidos
    } catch (error) {
        console.error('Erro ao criar post: ', error)
        // Relança o erro para que quem chamou a função saiba que falhou
        throw error
    }
}

export async function editPost(titulo,texto) {
    try {

        const params = new URLSearchParams(window.location.search)
        const post_id = params.get('id')

        const admin = isAdmin()

        if (!admin){
            throw new Error('Admin é false')
        }
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/editar_post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',     
            },
            credentials: 'include', 
            body: JSON.stringify(post_id,titulo,texto)
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

export async function deletePost() {
    try {
        const params = new URLSearchParams(window.location.search)
        const post_id = params.get('id')
        
        const admin = isAdmin()
        if(!admin){
            throw new Error('Admin é false')
        }
        const requisicao = await fetch(`${CONFIG.API_BASE_URL}/post/deletar_post`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(post_id)
        })
        if (!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`);
        }
        return console.log('Post deletado com sucesso')
    } 
    catch (error) {
        console.error('Erro ao deletar:', error)
        throw error
    }
}