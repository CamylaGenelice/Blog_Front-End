import { isAdmin, checkAuthStatus } from "./auth.js"

const CONFIG = {
    API_BASE_URL: 'https://meu-blog-kappa.vercel.app/',  // Altere para a URL do seu backend
    POST_ID_TO_DISPLAY: 4,                  // ID do post que será exibido na home
    MAX_RECENT_POSTS: 5, 
}

export async function createComment(texto,post_id) {
    try {
        
        const status = await checkAuthStatus()

        if(!status){
            throw new Error('Usuario não esta autenticado ')
        }
        
        const requisicao = await fetch (`${CONFIG.API_BASE_URL}/comments/posts/${post_id}/comments/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                texto: texto,
                post_id: post_id
            })
        })
        if (!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }

        const comentarioCriado = await requisicao.json()
        return comentarioCriado
    } 
    catch (error) {
        console.error('Erro ao criar comentario: ',error)
        throw error
    }
}

export async function deleteComment(comment_id, post_id) {
    try {
        const status = await checkAuthStatus()
        
        if(!status){
            throw new Error('Usuario não esta autenticado ')
        }
        

        const requisicao = await fetch (`${CONFIG.API_BASE_URL}/comments/comments/${comment_id}?post_id=${post_id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            
        })
        if (!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }
        return true
    }
    catch (error) {
        console.error('Erro ao deletar comentario: ',error)
        throw error
    }
}

export async function editComment(id, texto) {
    try {
        const status = await checkAuthStatus()

        if(!status){
            throw new Error('Usuario não autenticado')
        }

        const formData = FormData()
        formData.append('id',id)
        formData.append('texto',texto)

        const requisicao = await fetch (`${CONFIG.API_BASE_URL}/comments/edit`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(formData)

        })
        if(!requisicao){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }

        const comentarioEditado = await requisicao.json()
        return comentarioEditado
    } 
    catch (error) {
        console.error('Erro ao editar comentario ',error)
        throw error
    }
}

export async function getComments(post_id) {
    try {
        
        const requisicao = await fetch (`${CONFIG.API_BASE_URL}/comments/posts/${post_id}/comments`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            

        })
        if (requisicao.status === 404) {
            return { content: [] }; // retorna estrutura compatível com o esperado
        }

        if(!requisicao.ok){
            const erro = await requisicao.json()
            throw new Error (`Erro: ${JSON.stringify(erro)}`)
        }

        const comentarios = await requisicao.json()
        return comentarios
    } 
    catch (error) {
        console.error('Erro ao buscar comentarios ',error)
        throw error
    }
}
