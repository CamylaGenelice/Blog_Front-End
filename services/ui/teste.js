import {createPost, getPosts, getPostName, getPostId} from '../api/posts.js'
import {checkAuthStatus, isAdmin, fetchUserProfile, userCache} from '../api/auth.js'

const container = document.getElementById('posts-container')

// * função carrega os posts e injeta eles dentro de uma tag para deixar dinâmico
async function exibirPosts(){
    try {
        if (!container){
            console.error('Elemento #post-container não encontrado')
        }
        container.innerHTML = `<p>Carregando posts...</p>`

        const posts = await getPosts()

        if(!Array.isArray(posts) || posts.length === 0){
            container.innerHTML = '<p>Nenhum post encontrado.</p>';
            return;
        }
        let postsHTML = '';
        posts.forEach((post) => {
            const dataFormatada = post.created_at
                ? new Date(post.created_at).toLocaleDateString('pt-BR')
                : 'Data recente';

        postsHTML += `
            <article class="post-card">
            <h2 class="post-title">${post.titulo}</h2>
            <p class="post-date">Publicado em: ${dataFormatada}</p>
            <div class="post-content">
                <p>${post.conteudo}</p>
            </div>
            <a href="./post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </article>
      `;

    });
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
        document.addEventListener('DOMContentLoaded',() => {
            exibirPosts()
        })
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
