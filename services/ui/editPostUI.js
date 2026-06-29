
import { getPosts, editPost, deletePost } from "../api/posts.js"

const container = document.getElementById('posts-container')
const containerWrapper = document.getElementById('posts-container-wrapper')
const formulario = document.getElementById('formulario')
const inputTitulo = document.getElementById('postTitulo')
const botaoCancelar = formulario ? formulario.querySelector('button[type="button"]') : null

let listaDePosts = [] // Guardará os posts carregados na memória
let idPostSendoEditado = null

window.deletarPost = deletarPost
window.editarPost = editarPost

// Esconde o formulário logo no carregamento inicial do script
if(formulario){
    formulario.classList.add('d-none')
}

async function exibirPosts(){
    try {
        if(!container){
            return
        }

        // Garante o estado visual inicial: Lista visível, Formulário escondido
        if (containerWrapper) containerWrapper.classList.remove('d-none')
        if (formulario) formulario.classList.add('d-none')

        // Mostra indicador de carregamento
        container.innerHTML = 
        `<div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
        </div> `

        const resultado = await getPosts()
        listaDePosts = resultado.post || resultado

        
        if(!listaDePosts || listaDePosts.length === 0){
            container.innerHTML = '<p class="text-muted">Nenhum post encontrado.</p>';
            return
        }
        let postsHTML = ''

        listaDePosts.forEach (post => {
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
                            <button onclick="editarPost('${post.id}')" class="btn btn-link p-0 text-decoration-none fw-bold">
                                Editar 
                            </button>
                            <button onclick="deletarPost('${post.id}')" class="btn btn-link p-0 text-danger text-decoration-none fw-bold">
                                Deletar <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </article> `
        })
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

// Função utilitária para segurança contra XSS
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Ativada quando clica no botão "Editar ->"
function editarPost(postId) {
    const post = listaDePosts.find(p => String(p.id) === String(postId))

    if (!post) {
        alert("Post não encontrado!")
        return
    }

    if (inputTitulo) {
        inputTitulo.value = post.titulo
    }

    // Alimenta o TinyMCE com o conteúdo do post escolhido
    if (window.tinymce && tinymce.get('postContent')) {
        tinymce.get('postContent').setContent(post.conteudo)
    } else {
        const textarea = document.getElementById('postContent')
        if (textarea) textarea.value = post.conteudo
    }

    idPostSendoEditado = postId

    // Esconde a lista e exibe o formulário preenchido
    if(containerWrapper){
        containerWrapper.classList.add('d-none')
    }
    if(formulario){
        formulario.classList.remove('d-none')
    }

    window.scrollTo({top: 0, behavior: 'smooth'})
}

function voltarParaLista() {
    if (formulario) {
        formulario.reset()
    }
    if (window.tinymce && tinymce.get('postContent')) {
        tinymce.get('postContent').setContent('')
    }
    idPostSendoEditado = null
    
    // Inverte a visibilidade: oculta formulário, exibe listagem de posts
    if (formulario) formulario.classList.add('d-none')
    if (containerWrapper) containerWrapper.classList.remove('d-none')
}

async function deletarPost(post_id) {
    if (!confirm("Tem certeza que deseja deletar este post?")) {
        return
    }
    try {
        await deletePost(post_id)
        alert('Post deletado com sucesso')
        await exibirPosts()
    } 
    catch (error) {
        alert('Houve um erro ao tentar deletar o post.')
    }
    
}

// Configura o botão Cancelar para alternar a tela dinamicamente
if (botaoCancelar) {
    botaoCancelar.removeAttribute('onclick') // Remove o comportamento padrão de redirecionamento do HTML
    botaoCancelar.addEventListener('click', voltarParaLista)
}


if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault()

        if (!idPostSendoEditado){
            alert('Selecione um post da lista para editá-lo')
            return
        }

        const titulo = inputTitulo.value
        let texto = ''

        // Captura o HTML atualizado de dentro do TinyMCE
        if(window.tinymce && tinymce.get('postContent')){
            texto = tinymce.get('postContent').getContent()
        } else {
            texto = document.getElementById('postContent').value
        }

        try {
            // Envia os parâmetros organizados para a API externa
            await editPost(idPostSendoEditado, titulo, texto)
            alert('Post atualizado com sucesso!')

            voltarParaLista()   // Traz o utilizador de volta à listagem
            await exibirPosts() // Atualiza os blocos na tela com os novos dados
        } 
        catch (error) {
            console.error("Erro ao atualizar o post:", error)
            alert("Houve um erro ao salvar as alterações.")
        }
    })
}

// Inicialização automática ao abrir a página pela primeira vez
(function(){
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', exibirPosts)
    } else {
        exibirPosts()
    }
})()