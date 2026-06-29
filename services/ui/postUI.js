import { protegerPaginaAdmin } from '../middleware/protecaoLinks.js';
import {createPost, getPosts, getPostName, getPostId} from '../api/posts.js'
import {checkAuthStatus, isAdmin, fetchUserProfile, initAuth} from '../api/auth.js'
import { carregarComentarios, deleteComentario, configurarFormularioComentario } from './commentsUI.js';
import {getComments, createComment, deleteComment, editComment} from '../api/comments.js'
import { exibirMensagem } from './DOM_Elements/elements_registration.js';

const postForm = document.getElementById('postForm')

//* tornando a função global para o navegador encontrar
window.verPostUnico = verPostUnico 
window.voltarParaLista = voltarParaLista
window.deleteComentario = deleteComentario
document.addEventListener('DOMContentLoaded', inicializarPagina)
//document.addEventListener('DOMContentLoaded',protegerPaginaAdmin)

// ************** Mostrar Posts ****************

const container = document.getElementById('posts-container')

// * função carrega os posts e injeta eles dentro de uma tag para deixar dinâmico
async function exibirPosts(){
    try {
        if(!container){
            return
        }
        // Mostra indicador de carregamento
        container.innerHTML = 
        `<div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
        </div> `

        const resultado = await getPosts()
        const posts = resultado.post || resultado

        if(!posts || posts.length === 0){
            container.innerHTML = '<p class="text-muted">Nenhum post encontrado.</p>';
            return
        }
        let postsHTML = ''

        posts.forEach (post => {
            // Formação básica de data
            const dataFormatada = post.created_at ? new Date(post.created_at).toLocaleDateString('pt-BR') : 'Data Recente'

            postsHTML += `
                <article class="card post-card mb-4 p-3 bg-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary category-badge">Desenvolvimento</span>
                            <small class="text-muted">${dataFormatada}</small>
                        </div>
                        <h2 class="h4 card-title fw-bold">${escapeHtml(post.titulo)}</h2>
                        <div class="card-text text-secondary">
                            ${post.conteudo.substring(0, 200)}${post.conteudo.length > 200 ? '...' : ''}
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-4">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-person-circle fs-4 me-2"></i>
                                <span class="small fw-semibold">Autor</span>
                            </div>
                            <button onclick="verPostUnico('${post.id}')" class="btn btn-link p-0 text-decoration-none fw-bold">
                                Ler post completo &rarr;
                            </button>
                        </div>
                    </div>
                </article> `

        })
        // Injeta o HTML construído de uma só vez para melhor performance
        container.innerHTML = postsHTML;
    } 
    catch (error) {
        //console.error('Erro ao exibir posts:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                Erro ao carregar os posts. Tente novamente mais tarde.
            </div> `;
    }
}
// * função auxilixar para exibir os posts
(function(){
    if(document.readyState === 'loading'){
        // Se o navegador ainda estiver baixando o HTML, espera terminar
        document.addEventListener('DOMContentLoaded',exibirPosts)
    }
    else{
        // Se o HTML já carregou, executa a função imediatamente
        exibirPosts()
    }
})()

// Função utilitária para segurança
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}



// ************** Pegar um post pelo id ****************
// 1. Função que decide o que mostrar ao carregar a página
async function inicializarPagina() {

    await initAuth()

    if(document.readyState ==='loading'){
        document.addEventListener('DOMContentLoaded',protegerPaginaAdmin)
    }
    else{
        protegerPaginaAdmin()
    }
    const params = new URLSearchParams(window.location.search)
    const post_id = params.get('id')

    if(post_id){
        // Se tem ID na URL, mostra só aquele post
        await verPostUnico(post_id)
    }
    else{
        await exibirPosts()
    }
}

export async function verPostUnico(id) {
   
    const containerLista = document.getElementById('posts-container-wrapper');
    const containerDetalhe = document.getElementById('post-detalhado');
    const conteudoDiv = document.getElementById('conteudo-do-post');
    
    try {
        // Esconde a lista, mostra o container de detalhes
        containerLista.classList.add('d-none')
        containerDetalhe.classList.remove('d-none')
        

        conteudoDiv.innerHTML = '<div class="spinner-border"></div>';

        
        const post = await getPostId(id)
        
        const imagemCapa = post.imagem_nome_arquivo 
            ? `<img src="http://127.0.0.1:8000/static/${post.imagem_nome_arquivo}" 
                    class="img-fluid rounded mb-4 w-100" 
                    alt="${escapeHtml(post.titulo)}" 
                    style="max-height: 1000px; object-fit: cover;">`
            : '';

        // 3. Renderiza o conteúdo completo
        conteudoDiv.innerHTML = `
            <article>
                <div class="mt-3"> ${imagemCapa}  </div>
                <h3 class="display-4 fw-bold">${escapeHtml(post.titulo)}</h3>
                <p class="text-muted">Publicado em: ${new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
                <hr>
                <div class="mt-4 fs-5">
                    ${post.conteudo} 
                </div>
            </article>
        `;
        await carregarComentarios(id)
        configurarFormularioComentario(id)
    } 
    catch (error) {
        console.error("Erro ao carregar post:", error);
        conteudoDiv.innerHTML = '<div class="alert alert-danger">Erro ao carregar o conteúdo.</div>';
    }
   
}

//* Função para resetar a visão dos posts
function voltarParaLista() {
    const containerLista = document.getElementById('posts-container-wrapper');
    const containerDetalhe = document.getElementById('post-detalhado');

    containerLista.classList.remove('d-none')
    containerDetalhe.classList.add('d-none')
    
}

// ************** Edição dos posts ****************


