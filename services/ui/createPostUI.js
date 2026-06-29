import { protegerPaginaAdmin } from '../middleware/protecaoLinks.js';
import {createPost} from '../api/posts.js'
import { initAuth, checkAuthStatus } from '../api/auth.js';
import { exibirMensagem, limparFormulario } from './DOM_Elements/elements_registration.js';

const postForm = document.getElementById('postForm')

if(postForm){
    postForm.addEventListener('submit', async (event) => {
    event.preventDefault();


    const submitButton = postForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    const titulo = document.getElementById('postTitle').value;
    const conteudo = tinymce.get("postContent").getContent();
    const inputImagem = document.getElementById('inputImagem')
    const arquivoImagem = inputImagem.files.length > 0 ? inputImagem.files[0] : null



    try {

        await initAuth()
        
        
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
        // document.getElementById('timestampField').value = new Date().toISOString();

        const resposta = await createPost(titulo,conteudo, arquivoImagem)
        alert('Post criado com sucesso!')
        postForm.reset()
        
    }
     
    catch (error) {
        console.error("Erro:", error);
        alert('Falha ao criar post')
    }
    finally{
        submitButton.disabled = false
        submitButton.innerHTML = originalButtonText
    }
    
});
}

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

// * Função que impede outros usuarios de acessar a página de criação de posts

async function verificarPermissaoUsuario() {
    try {
        if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded',protegerPaginaAdmin)
    }
    else{
        protegerPaginaAdmin()
    }
    } 
    catch (error) {
        console.error(error)
    }
    
}


