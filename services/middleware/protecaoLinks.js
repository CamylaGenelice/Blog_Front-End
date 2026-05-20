import { initAuth } from "../api/auth";

export async function isAdmin() {
    try {
        const usuario = await initAuth();
        const roleId = usuario?.objeto?.role_id;
        if(roleId === 2){
            return roleId
        }
        return false
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return false;
    }
}
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

export async function redirecionamento() {
    const admin = await isAdmin()

    if(!admin){
        window.location.href = 'home.html'
    }
}