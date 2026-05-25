import {verPostUnico} from '../ui/post_commentUI.js'
window.verPostUnico = verPostUnico

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
export function renderizarPost() {
    try {
        
        const container = document.getElementById('lista-posts')
        const dadosSalvos = sessionStorage.getItem('resultadosBusca')

        if(!dadosSalvos){
            container.innerHTML = '<p>Nenhum resultado para exibir.</p>'
            return
        }
        const posts = JSON.parse(dadosSalvos)

        container.innerHTML = posts.map(post => `
            <article class="card post-card mb-4 p-3 bg-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                        
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
                </article>

        
    `).join('');
    } 
    catch (error) {
        console.error(error)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarPost()
})
 
        // <div class="card mb-3">
        //     <div class="card-body">
        //         <h3>${post.titulo}</h3>
        //         <a href="post.html?id=${post.id}" class="btn btn-primary">Ler este post</a>
        //     </div>
        // </div>