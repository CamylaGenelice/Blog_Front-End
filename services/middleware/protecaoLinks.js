import { initAuth } from "../api/auth.js";


export async function protegerPaginaAdmin() {
    try {
        const usuario = await initAuth()
        const role_id = usuario?.objeto?.role_id

        if(role_id !== 2){
            const elementosRestritos = document.querySelectorAll('[data-role-admin]')
            elementosRestritos.forEach(elementos => {
                elementos.remove()
            })
        }
        return true
    } 
    catch (error) {
        console.error('Não foi possivel identificar o usuario: ',error)
    }
}

// * Utilizar na página de criar post.  Caso não tenha nenhuma verificação de permissão de usuario.
export async function redirecionamento() {

    try {
        const usuario = await initAuth();
        const roleId = usuario?.objeto?.role_id;

        if(roleId !== 2){
            window.location.href = 'home.html'
    }
        return true
    } 
    catch (error) {
        console.error(error)
    }
    
}
