import { isAuthenticated, getUserRole } from "./auth.js";

function checkAccess() {
    const publicPages = ['login.html', 'home.html'];
    const currentPage = window.location.pathname.split("/").pop();

    // Se a página atual for de criação e o usuário não estiver logado
    if (currentPage === 'create-posts.html') {
        if (!isAuthenticated()) {
            alert("Você não tem permissão para acessar essa página.");
            window.location.href = 'home.html';
            return;
        }

        // Verificação de permissão específica (ex: apenas 'admin' ou 'autor')
        const role = getUserRole();
        if (role !== 'admin' && role !== 'autor') {
            alert("Você não tem permissão para criar posts.");
            window.location.href = 'index.html';
        }
    }
}

// Executa a verificação assim que o script carrega
checkAccess();