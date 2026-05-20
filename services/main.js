// Inicializa o Quill
import { initAuth } from "./api/auth.js";

(async function controlaMenu() {
    const role =  await initAuth()
    const isAdmin = role?.objeto?.role_id
    const menuCriarPost = document.getElementById('criarPost')

    if(menuCriarPost && isAdmin !== 2 ){
        menuCriarPost.remove()
    }
})()