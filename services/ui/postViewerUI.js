// services/ui/postViewer.js
import { getPostId } from '../api/posts.js';

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function exibirPost(post) {
    const container = document.getElementById('lista-posts');
    if (!container) return;
    container.innerHTML = `
        <article class="post-completo">
            <h1 class="mb-4">${escapeHtml(post.titulo)}</h1>
            <div class="conteudo">${post.conteudo}</div>
            <hr>
            <a href="home.html" class="btn btn-secondary">← Voltar para home</a>
        </article>
    `;
}

async function carregarPost() {
    // 1. Tenta obter post salvo pelo "Leia mais" (busca ou home)
    let postData = sessionStorage.getItem('postParaExibir');
    if (postData) {
        sessionStorage.removeItem('postParaExibir');
        exibirPost(JSON.parse(postData));
        return;
    }
    
    // 2. Fallback: buscar por ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
        try {
            const post = await getPostId(postId);
            exibirPost(post);
        } catch (error) {
            document.getElementById('lista-posts').innerHTML = '<p class="text-danger">Post não encontrado.</p>';
        }
    } else {
        document.getElementById('lista-posts').innerHTML = '<p class="text-warning">Nenhum post selecionado.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarPost);