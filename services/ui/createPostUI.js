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

        const resposta = await createPost(titulo,conteudo)

        if(!resposta){
           return false
        }
        return {msg: 'Post criado com sucesso'}
        
    }
     
    catch (error) {
        console.error("Erro:", error);
        
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

export async function protegerPaginaAdmin() {
    const usuario = await initAuth()
    const roleId = usuario?.objeto?.role_id

    if( roleId !== 2){
        return false
    }
    return true
}

protegerPaginaAdmin()

