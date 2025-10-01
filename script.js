// Configurações do usuário
const VALID_CREDENTIALS = {
    usuario: 'aluno@exemplo.com', 
    senha: '123456', 
    nome: 'Ana Clara Gonçalves', 
    email: 'aluno@exemplo.com',
    id: '24204708360089'
};

// Funções comuns (usadas em todas as páginas)
function logout(event) {
    if (event) event.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('login_token');
    if (!token) {
        window.location.href = 'index.html';
    }
}

// Lógica de Inicialização por Página
document.addEventListener('DOMContentLoaded', () => {
    
    const page = window.location.pathname.split('/').pop();
    
    // Lógica para INDEX.HTML (Login)
    if (page === 'index.html' || page === '') {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        const loginCard = document.getElementById('loginCard');

        // Se já estiver logado, redireciona para a home
        const token = localStorage.getItem('login_token');
        if (token) {
            window.location.href = 'home.html';
            return; // Interrompe a execução
        }
        
        function handleLogin(event) {
            event.preventDefault();
            const inputUsuario = document.getElementById('usuario').value.trim();
            const inputSenha = document.getElementById('password').value.trim();
            const isUserValid = (inputUsuario === VALID_CREDENTIALS.usuario || inputUsuario === VALID_CREDENTIALS.email);
            const isPasswordValid = (inputSenha === VALID_CREDENTIALS.senha);

            if (isUserValid && isPasswordValid) {
                localStorage.setItem('login_token', 'minimal-session-token-' + new Date().getTime());
                localStorage.setItem('user_name', VALID_CREDENTIALS.nome);
                localStorage.setItem('user_email', VALID_CREDENTIALS.email);
                localStorage.setItem('user_id', VALID_CREDENTIALS.id);
                
                errorMessage.textContent = ''; 
                window.location.href = 'home.html';
            } else {
                errorMessage.textContent = 'Login inválido. Tente novamente com aluno@exemplo.com/123456.';
                document.getElementById('password').value = '';
            }
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (loginCard) {
            loginCard.style.opacity = '0';
            loginCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                loginCard.style.transition = 'all 0.5s ease-out';
                loginCard.style.opacity = '1';
                loginCard.style.transform = 'translateY(0)';
            }, 100);
        }
    } 
    // Lógica para as páginas internas (Home, Tarefas e Perfil)
    else {
        checkAuth(); // Verifica a autenticação em todas as páginas
        
        if (page === 'home.html') {
            const userName = localStorage.getItem('user_name') || 'Aluno(a)';
            const welcomeMessage = document.getElementById('welcomeMessage');
            if(welcomeMessage) {
                welcomeMessage.textContent = `Bem-vindo(a), ${userName.split(' ')[0]}!`;
            }
        } 
        else if (page === 'perfil.html') {
            document.getElementById('userName').textContent = localStorage.getItem('user_name') || 'Nome não encontrado';
            document.getElementById('userEmail').textContent = localStorage.getItem('user_email') || 'aluno@exemplo.com';
            document.getElementById('userMatricula').textContent = `Matrícula: ${localStorage.getItem('user_id') || 'N/A'}`;
            const now = new Date();
            const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
            document.getElementById('lastAccess').textContent = formattedDate;
        }
    }
});