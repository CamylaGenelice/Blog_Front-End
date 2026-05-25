// Inicializa o Quill
import { initAuth } from "./api/auth.js";
import {getPostName} from './api/posts.js'
import { protegerPaginaAdmin } from "./middleware/protecaoLinks.js";



(async function controlaMenu() {
    try {
        await protegerPaginaAdmin()
    } catch (error) {
        console.error(error)
    }
})()

const barraPesquisa = document.getElementById('formBarraPesquisa')

barraPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault()

    const container = document.getElementById('container')
    const nomePost = document.getElementById('tituloPost').value
    try {
       
        if ( !nomePost ||nomePost.trim() == ''){
        alert("Digite alguma coisa antes de pesquisar");
            return;
    }
    // * Feedback visual de carregamento
        container.innerHTML = '<div class="text-center"><div class="spinner-border"></div></div>';

        const resposta = await getPostName(nomePost)
        
        if(resposta && resposta.length > 0){
            sessionStorage.setItem('resultadosBusca',JSON.stringify(resposta))
            window.location.href = 'post.html'
        }
        else{
            
        }
        
    } 
    catch (error) {
        console.error('Erro na busca', error)
        alert('Erro ao pesquisar')
    }
})