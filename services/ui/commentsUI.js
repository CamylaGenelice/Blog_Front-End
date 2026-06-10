import { checkAuthStatus, isAdmin } from "../api/auth.js"
import { getComments, createComment, deleteComment } from "../api/comments.js"


// ************** Exibição dos comentários do post ****************
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

export async function carregarComentarios(post_id) {

    const lista = document.getElementById('lista-comentarios')
    lista.innerHTML = '<div class="spinner-border spinner-border-sm"></div> Carregando comentários...'

    try {

        
        let usuarioLogado = null;
        let isUserAdmin = false;

        try {
            usuarioLogado = await checkAuthStatus();
            
            if (usuarioLogado) {
                isUserAdmin = await isAdmin();
            }
        } catch (authError) {
            console.warn("Erro ao verificar autenticação:", authError);
            // Se falhou, assume que não é admin e segue
            usuarioLogado = null;
            isUserAdmin = false;
        }

        // 2. Busca os comentários
        const resposta = await getComments(post_id);
        
        
        let comentarios = [];

        if (resposta && Array.isArray(resposta.content)) {
            comentarios = resposta.content;
        } 
        else if (Array.isArray(resposta)) {
            comentarios = resposta;
        } 
        else {
            comentarios = [];
        }

        // 3. Se não há comentários, mostra mensagem amigável e sai
        if (comentarios.length === 0) {
            lista.innerHTML = '<p class="text-muted">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }

        // 4. Renderiza os comentários normalmente
        const usuarioId = usuarioLogado?.objeto?.id ? parseInt(usuarioLogado.objeto.id) : null;

        lista.innerHTML = comentarios.map(coment => {
            const ehDono = (usuarioId !== null && usuarioId === coment.id_usuario);
            let botaoDeletar = '';

            if (isUserAdmin || ehDono) {
                botaoDeletar = `
                    <button class="btn btn-sm text-danger" onclick="deleteComentario('${coment.id}', '${coment.post_id}')">
                        <i class="bi bi-trash"></i> Deletar
                    </button>`;
            }

            return `
                <div class="card mb-2 bg-light border-0">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between">
                            <strong>${escapeHtml(coment.nome_usuario)}</strong>
                            ${botaoDeletar}
                        </div>
                        <p class="mb-0">${escapeHtml(coment.texto)}</p>
                    </div>
                </div>
            `;
        }).join('');
    } 
    catch (error) {
        console.error('Erro na função de carregamento de comentários: ',error)
        lista.innerHTML = '<p class="text-danger">Erro ao carregar comentários.</p>';
    }
}

// Função de formulario para criar um comentário
export async function configurarFormularioComentario(postId) {

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
        const texto = document.getElementById('textoComentario').value

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

export async function deleteComentario(comentarioId, postId) {

    try {
        const mensagem = document.getElementById('mensagem')
        const resposta = await deleteComment(comentarioId,postId)
        if(!resposta){
            mensagem.innerHTML = '<p class="text-danger">Erro ao deletar comentário.</p>'
        }
        await carregarComentarios(postId)

    } catch (error) {
        console.error('Erro ao deletar comentário: ',error)
        
    }

}
