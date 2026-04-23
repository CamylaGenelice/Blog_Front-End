import {createPost, getPosts, getPostName, getPostId} from '../api/posts.js'
import {checkAuthStatus} from '../api/auth.js'
import {getComment, createComment} from '../api/comments.js'
import { exibirMensagem } from './DOM_Elements/elements_registration.js';

const postForm = document.getElementById('postForm')

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();


    const submitButton = postForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    const titulo = document.getElementById('postTitle').value;
    const conteudo = tinymce.get("postContent").getContent();
     


    try {
        if (!conteudo || conteudo.trim() === "") {
            alert("O conteúdo do post é obrigatório");
        }
        if (!titulo || titulo.trim() === "") {
            alert("O título do post é obrigatório");
            return;
        }
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Publicando...
        `;

        // Preenche o timestamp automaticamente
        document.getElementById('timestampField').value = new Date().toISOString();

        const resposta = await createPost(titulo,conteudo)

        if(!resposta){
            exibirMensagem('Erro ao criar post', 'erro')
        }

        exibirMensagem('Post criado com sucesso', 'success')
    }
     
    catch (error) {
        console.error("Erro:", error);
        exibirMensagem('Erro ao criar post', 'erro')
    }
    finally{
        submitButton.disabled = false
        submitButton.innerHTML = originalButtonText
    }
    
});

// Validação visual do Bootstrap 
(function() {
    'use strict';
    
    // Obtém todos os formulários que precisam de validação customizada do Bootstrap
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop e previne o envio padrão
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
})();

// ************** Mostrar Posts ****************

const container = document.getElementById('posts-container')

// * função carrega os posts e injeta eles dentro de uma tag para deixar dinâmico
async function exibirPosts(){
    try {
        // Mostra indicador de carregamento
        container.innerHTML = 
        <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
        </div>

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
        console.error('Erro ao exibir posts:', error);
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

// ************** Barra de Pesquisa ****************

const barraPesquisa = document.getElementById('formBarraPesquisa')

barraPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nomePost = document.getElementById('tituloPost').value
    try {
       
        if ( !nomePost ||nomePost.trim() == ''){
        alert("Digite alguma coisa antes de pesquisar");
            return;
    }
    // * Feedback visual de carregamento
        container.innerHTML = '<div class="text-center"><div class="spinner-border"></div></div>';

        const resposta = await getPostName(nomePost)
        
        container.innerHTML = ''

        // Caso o backend retorne null ou lista vazia

        if(!resposta || (Array.isArray(resposta) && resposta.length === 0)){
            container.innerHTML = '<div class="alert alert-warning">Nenhum post encontrado com esse título.</div>'
            return
        }
        // *Se o backend retornar um array de resultados, tratamos como lista
        // *Se retornar um único objeto, colocamos em um array para usar o forEach

        const resultados = Array.isArray(resposta) ? resposta : [resposta];

        resultados.forEach(post => {
            const postHTML = `
                <article class="card post-card mb-4 p-3 bg-white border-primary shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <span class="badge bg-info text-dark">Resultado da Busca</span>
                            <small class="text-muted">ID: ${post.id}</small>
                        </div>
                        <h2 class="h4 card-title fw-bold mt-2">${escapeHtml(post.titulo)}</h2>
                        <div class="card-text text-secondary">
                            ${post.conteudo.substring(0, 200)}...
                        </div>
                        <div class="mt-3">
                            <a href="visualizar_post.html?id=${post.id}" class="btn btn-primary btn-sm">Ver Post Completo</a>
                            <button onclick="window.location.reload()" class="btn btn-link btn-sm text-secondary">Voltar para todos os posts</button>
                        </div>
                    </div>
                </article>
            `;
            container.innerHTML += postHTML;
        });
    } 
    catch (error) {
        console.error('Erro na busca', error)
        container.innerHTML = '<div class="alert alert-danger">Erro ao realizar a busca.</div>'
    }
    

})


// ************** Pegar um post pelo id ****************
// 1. Função que decide o que mostrar ao carregar a página
async function inicializarPagina() {
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

async function verPostUnico(id) {
    const containerLista = document.getElementById('posts-container-wrapper');
    const containerDetalhe = document.getElementById('post-detalhe');
    const conteudoDiv = document.getElementById('conteudo-do-post');
    
    try {
        // Esconde a lista, mostra o container de detalhes
        document.getElementById('posts-container-wrapper').classList.add('d-none')
        document.getElementById('post-detalhe').classList.remove('d-none')

        conteudoDiv.innerHTML = '<div class="spinner-border"></div>';

        
        const post = await getPostId(id)
        const conteudoDiv = document.getElementById('conteudo-do-post')

        // 3. Renderiza o conteúdo completo
        conteudoDiv.innerHTML = `
            <article>
                <h1 class="display-4 fw-bold">${escapeHtml(post.titulo)}</h1>
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

// Função para resetar a visão
function voltarParaLista() {
    document.getElementById('posts-container-wrapper').classList.remove('d-none');
    document.getElementById('post-detalhe').classList.add('d-none');
}

// ************** Exibição dos comentários do post ****************
async function carregarComentarios(post_id) {
    const lista = document.getElementById('lista-comentarios')
    lista.innerHTML = '<div class="spinner-border spinner-border-sm"></div> Carregando comentários...'

    try {
        const comentarios = await getComment(post_id)

        if(!comentarios || comentarios.length === 0){
            lista.innerHTML = '<p class="text-muted">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }
        lista.innerHTML = comentarios.map( coment => `<div class="card mb-2 border-0 bg-light">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between">
                        <strong>${escapeHtml(com.autor_nome || 'Usuário')}</strong>
                        <small class="text-muted">${new Date(com.created_at).toLocaleDateString()}</small>
                    </div>
                    <p class="mb-0 mt-1">${escapeHtml(com.texto)}</p>
                </div>
            </div>`).join('')
    } 
    catch (error) {
        console.error('Erro na função de carregamento de comentários: ',error)
        lista.innerHTML = '<p class="text-danger">Erro ao carregar comentários.</p>';
    }
}

async function configurarFormularioComentario(postId) {
    const container = document.getElementById('formulario-comentario-container')
    const resposta = await checkAuthStatus()

    if(!resposta){
        container.innerHTML = `
            <div class="alert alert-info">
                Faça <a href="login.html">login</a> para deixar um comentário.
            </div>`;
        return;
    }

    container.innerHTML = `
        <form id="formNovoComentario">
            <div class="mb-3">
                <textarea class="form-control" id="textoComentario" rows="3" placeholder="Escreva seu comentário..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Publicar Comentário</button>
        </form>
    `;

    document.getElementById('formNovoComentario').addEventListener('submit', async(e) => {
        e.preventDefault()
        const texto = document.getElementById('textoComentario').value = ''

        try {
            await createComment(texto,postId)
            // Limpa campo
            document.getElementById('textoComentario').value = ''
            await carregarComentarios(postId)

        } 
        catch (error) {
            exibirMensagem('Erro ao enviar comentário', 'erro')
        }
    })
}