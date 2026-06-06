import { getPostName } from "../api/posts.js";

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

async function carregarResultado() {
    const container = document.getElementById('lista-resultados');
    const termoElement = document.getElementById('termo-buscado');

    let resultados = sessionStorage.getItem('resultadosBusca')
    

    if (!resultados){
        // Fallback: ler termo da URL ?q=...
        const urlParams = new URLSearchParams(window.location.search);
        const termo = urlParams.get('q');

        if(termo){
            termoElement.textContent = termo

            try {
                const posts = await getPostName(termo)
                resultados = JSON.stringify(posts)
            } 
            catch (error) {
                container.innerHTML = '<p class="text-danger">Erro na busca.</p>';
                return
            }
        }
        else {
            container.innerHTML = '<p>Nenhum termo de busca informado.</p>';
            return;
        }
    }
    const posts = JSON.parse(resultados)
    termoElement.textContent = sessionStorage.getItem('ultimoTermoBusca') || '';

    if (!posts.length) {
        container.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="card mb-4 p-3">
            <h3 class="h5">${escapeHtml(post.titulo)}</h3>
            <div class="text-secondary">${post.conteudo.substring(0, 150)}...</div>
            <button class="btn btn-link p-0 mt-2 text-primary" data-post='${JSON.stringify(post)}'>
                Ler post completo →
            </button>
        </article>
    `).join('');

     // Adiciona eventos para cada botão (envia post único para post.html)
    document.querySelectorAll('[data-post]').forEach(btn => {
        btn.addEventListener('click', () => {
            const post = JSON.parse(btn.getAttribute('data-post'));
            sessionStorage.setItem('postParaExibir', JSON.stringify(post));
            window.location.href = `post.html?id=${post.id}`;
        });
    });
    
    // Limpa o storage para não reutilizar na próxima visita
    sessionStorage.removeItem('resultadosBusca');
    sessionStorage.removeItem('ultimoTermoBusca');
}

document.addEventListener('DOMContentLoaded', carregarResultado)