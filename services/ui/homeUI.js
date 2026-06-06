import { getPosts } from "../api/posts.js"


function escapeHtml(texto) {
    if(!texto) return ''

    const div = document.createElement('div')
    div.textContent = texto
    return div.innerHTML
}

async function carregarPostagensRecentes() {
    const container = document.getElementById('posts-recentes-container')

    if(!container) return

    try {
        const resultado = await getPosts()

        const posts = resultado.post || resultado

        if (!posts || posts.length === 0) {
            container.innerHTML = '<div class="col-100 text-center text-muted"><p>Nenhuma postagem recente encontrada.</p></div>';
            return;
        }
        // Opcional: Pegar apenas os 3 posts mais recentes
        const postsRecentes = posts.slice(0, 3)

        const cardsHTML = postsRecentes.map(post => {
            // Limita a exibição do texto no card para não quebrar o layout
            const resumoConteudo = post.conteudo.length > 120 
                ? post.conteudo.substring(0, 120) + '...' 
                : post.conteudo;

            return `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${escapeHtml(post.titulo)}</h5>
                            <p class="card-text text-secondary flex-grow-1">${resumoConteudo}</p>
                            <button data-post='${JSON.stringify(post)}' class="btn btn-sm btn-outline-primary mt-3 align-self-start btn-leia-mais">
                                Leia mais &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('')

        //Injeta os cards gerados no container da página
        container.innerHTML = cardsHTML;

        document.querySelectorAll('.btn-leia-mais').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postData = JSON.parse(btn.getAttribute('data-post'));
                sessionStorage.setItem('postParaExibir', JSON.stringify(postData));
                window.location.href = `post.html?id=${postData.id}&from=stored`;
            });
        });
    } 
    catch (error) {
        console.error('Erro ao carregar postagens da home:', error);
        container.innerHTML = `
            <div class="col-12 text-center text-danger">
                <p>Não foi possível carregar as postagens recentes no momento.</p>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded',carregarPostagensRecentes)