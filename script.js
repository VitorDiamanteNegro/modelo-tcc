// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('flashstudy_users')) || [];
        this.init();
    }

    init() {
        // Verificar se há usuário logado
        const savedUser = localStorage.getItem('flashstudy_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    // Login com email/senha
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('flashstudy_current_user', JSON.stringify(user));
            this.updateUI();
            this.showNotification('Login realizado com sucesso!', 'success');
            return true;
        }
        this.showNotification('E-mail ou senha incorretos', 'error');
        return false;
    }

    // Cadastro com email/senha
    signup(userData) {
        // Verificar se o email já existe
        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('Este e-mail já está cadastrado', 'error');
            return false;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}&background=4361ee&color=fff`
        };

        this.users.push(newUser);
        localStorage.setItem('flashstudy_users', JSON.stringify(this.users));

        // Logar automaticamente
        this.currentUser = newUser;
        localStorage.setItem('flashstudy_current_user', JSON.stringify(newUser));
        this.updateUI();

        this.showNotification('Conta criada com sucesso!', 'success');
        return true;
    }

    // Login com Google (simulado)
    loginWithGoogle() {
        // Simulação de login com Google
        const googleUser = {
            id: 'google_' + Date.now(),
            firstName: 'Usuário',
            lastName: 'Google',
            email: 'usuario@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            provider: 'google'
        };

        this.currentUser = googleUser;
        localStorage.setItem('flashstudy_current_user', JSON.stringify(googleUser));
        this.updateUI();
        this.showNotification('Login com Google realizado!', 'success');
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('flashstudy_current_user');
        this.updateUI();
        this.showNotification('Logout realizado com sucesso', 'info');
    }

    // Atualizar interface baseada no estado de login
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (this.currentUser) {
            // Usuário logado
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            
            userName.textContent = this.currentUser.firstName;
            userAvatar.src = this.currentUser.avatar;
            userAvatar.alt = this.currentUser.firstName;
        } else {
            // Usuário não logado
            loginBtn.style.display = 'block';
            signupBtn.style.display = 'block';
            userMenu.style.display = 'none';
        }
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Inicializar sistema de autenticação
const authSystem = new AuthSystem();

// Gerenciamento de Modais
class ModalManager {
    constructor() {
        this.modals = {
            login: document.getElementById('loginModal'),
            signup: document.getElementById('signupModal')
        };
        this.init();
    }

    init() {
        // Event listeners para abrir modais
        document.getElementById('loginBtn').addEventListener('click', () => this.openModal('login'));
        document.getElementById('signupBtn').addEventListener('click', () => this.openModal('signup'));

        // Event listeners para fechar modais
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });

        // Fechar modal ao clicar fora
        Object.values(this.modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Alternar entre login e cadastro
        document.querySelectorAll('.switch-to-signup').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeAllModals();
                this.openModal('signup');
            });
        });

        document.querySelectorAll('.switch-to-login').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeAllModals();
                this.openModal('login');
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            authSystem.logout();
        });

        // Força da senha
        const passwordInput = document.getElementById('signupPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.updatePasswordStrength);
        }
    }

    openModal(modalName) {
        this.closeAllModals();
        this.modals[modalName].style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    updatePasswordStrength() {
        const password = this.value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        let color = '#f44336';
        let text = 'Fraca';

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch(strength) {
            case 2:
                color = '#ff9800';
                text = 'Média';
                break;
            case 3:
                color = '#ffc107';
                text = 'Boa';
                break;
            case 4:
                color = '#4caf50';
                text = 'Forte';
                break;
        }

        strengthBar.style.setProperty('--strength-color', color);
        strengthBar.querySelector('::before').style.width = `${strength * 25}%`;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
}

// Inicializar gerenciador de modais
const modalManager = new ModalManager();

// Formulários de autenticação
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (authSystem.login(email, password)) {
        modalManager.closeAllModals();
    }
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        firstName: document.getElementById('signupFirstName').value,
        lastName: document.getElementById('signupLastName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value
    };
    
    if (authSystem.signup(userData)) {
        modalManager.closeAllModals();
    }
});

// Funções globais para login com Google
function loginWithGoogle() {
    authSystem.loginWithGoogle();
    modalManager.closeAllModals();
}

function signupWithGoogle() {
    authSystem.loginWithGoogle();
    modalManager.closeAllModals();
}

// ... (restante do código JavaScript anterior permanece igual) ...

// Funções dos flashcards (mantidas do código anterior)
function flipCard(card) {
    card.classList.toggle('flipped');
}

let currentCardIndex = 0;
const cards = document.querySelectorAll('.flashcard');

function nextCard() {
    if (cards.length > 0) {
        cards[currentCardIndex].classList.remove('active');
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        cards[currentCardIndex].classList.add('active');
    }
}

function prevCard() {
    if (cards.length > 0) {
        cards[currentCardIndex].classList.remove('active');
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        cards[currentCardIndex].classList.add('active');
    }
}

function rateCard(difficulty) {
    alert(`Card marcado como ${difficulty}`);
    nextCard();
}

function addFlashcard() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    
    if (question && answer) {
        alert('Flashcard adicionado com sucesso!');
        // Limpar formulário
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        document.getElementById('category').value = '';
        document.getElementById('hint').value = '';
    } else {
        alert('Por favor, preencha a pergunta e a resposta.');
    }
}

function selectDeck(deckName) {
    alert(`Baralho "${deckName}" selecionado!`);
    showSection('flashcards');
}

function createNewDeck() {
    const deckName = prompt('Digite o nome do novo baralho:');
    if (deckName) {
        alert(`Baralho "${deckName}" criado com sucesso!`);
    }
}

function showSection(sectionId) {
    // Verificar se precisa de login
    if (sectionId !== 'home' && !authSystem.currentUser) {
        modalManager.openModal('login');
        return;
    }

    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('section-hidden');
        section.classList.remove('active-section');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('section-hidden');
        targetSection.classList.add('active-section');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Configurar cards
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === 0) card.classList.add('active');
        });
    }
});

// Fechar modais com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        modalManager.closeAllModals();
    }
});