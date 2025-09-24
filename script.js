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
        
        // Configurar eventos
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Formulário de Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Formulário de Cadastro
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Força da senha
        document.getElementById('signupPassword').addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Verificação de confirmação de senha
        document.getElementById('signupConfirmPassword').addEventListener('input', (e) => {
            this.checkPasswordMatch();
        });

        // Botões do hero
        document.getElementById('heroLoginBtn').addEventListener('click', () => {
            this.openModal('login');
        });

        document.getElementById('heroSignupBtn').addEventListener('click', () => {
            this.openModal('signup');
        });
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (this.login(email, password)) {
            this.closeModal();
            this.showNotification('Login realizado com sucesso!', 'success');
        }
    }

    handleSignup() {
        const formData = {
            firstName: document.getElementById('signupFirstName').value,
            lastName: document.getElementById('signupLastName').value,
            email: document.getElementById('signupEmail').value,
            password: document.getElementById('signupPassword').value,
            confirmPassword: document.getElementById('signupConfirmPassword').value
        };

        // Validações
        if (!this.validateSignup(formData)) {
            return;
        }

        if (this.signup(formData)) {
            this.closeModal();
            this.showNotification('Conta criada com sucesso!', 'success');
        }
    }

    validateSignup(formData) {
        // Verificar se todos os campos estão preenchidos
        for (let key in formData) {
            if (!formData[key]) {
                this.showNotification('Por favor, preencha todos os campos', 'error');
                return false;
            }
        }

        // Verificar se as senhas coincidem
        if (formData.password !== formData.confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return false;
        }

        // Verificar força da senha
        if (formData.password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return false;
        }

        // Verificar termos
        if (!document.getElementById('acceptTerms').checked) {
            this.showNotification('Você deve aceitar os termos de serviço', 'error');
            return false;
        }

        return true;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('flashstudy_current_user', JSON.stringify(user));
            this.updateUI();
            return true;
        }
        
        this.showNotification('E-mail ou senha incorretos', 'error');
        return false;
    }

    signup(userData) {
        // Verificar se o email já existe
        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('Este e-mail já está cadastrado', 'error');
            return false;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}&background=4361ee&color=fff&size=128`
        };

        this.users.push(newUser);
        localStorage.setItem('flashstudy_users', JSON.stringify(this.users));

        // Logar automaticamente
        this.currentUser = newUser;
        localStorage.setItem('flashstudy_current_user', JSON.stringify(newUser));
        this.updateUI();

        return true;
    }

    loginWithGoogle() {
        // Simulação de login com Google
        const googleUser = {
            id: 'google_' + Date.now(),
            firstName: 'Usuário',
            lastName: 'Google',
            email: 'usuario.google@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128&q=80',
            provider: 'google',
            createdAt: new Date().toISOString()
        };

        this.currentUser = googleUser;
        localStorage.setItem('flashstudy_current_user', JSON.stringify(googleUser));
        this.updateUI();
        this.closeModal();
        this.showNotification('Login com Google realizado com sucesso!', 'success');
    }

    signupWithGoogle() {
        this.loginWithGoogle(); // Mesma função para simplificar
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('flashstudy_current_user');
        this.updateUI();
        this.showNotification('Logout realizado com sucesso', 'info');
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const authStatus = document.getElementById('authStatus');
        const userWelcome = document.getElementById('userWelcome');
        const statusMessage = document.getElementById('statusMessage');
        const welcomeName = document.getElementById('welcomeName');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (this.currentUser) {
            // Usuário logado
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            authStatus.style.display = 'none';
            userWelcome.style.display = 'block';

            welcomeName.textContent = this.currentUser.firstName;
            userName.textContent = this.currentUser.firstName;
            userAvatar.src = this.currentUser.avatar;
            userAvatar.alt = this.currentUser.firstName;
        } else {
            // Usuário não logado
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            authStatus.style.display = 'block';
            userWelcome.style.display = 'none';
        }
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthValue = document.querySelector('.strength-value');
        
        let strength = 0;
        let color = '#f94144';
        let text = 'Muito fraca';

        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch(strength) {
            case 1:
                color = '#f94144';
                text = 'Fraca';
                break;
            case 2:
                color = '#f8961e';
                text = 'Regular';
                break;
            case 3:
                color = '#f9c74f';
                text = 'Boa';
                break;
            case 4:
                color = '#90be6d';
                text = 'Forte';
                break;
            case 5:
                color = '#43aa8b';
                text = 'Muito forte';
                break;
        }

        strengthBar.style.width = `${strength * 20}%`;
        strengthBar.style.background = color;
        strengthValue.textContent = text;
        strengthValue.style.color = color;
    }

    checkPasswordMatch() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const checkIcon = document.querySelector('.password-match .fa-check');
        const matchText = document.querySelector('.match-text');

        if (confirmPassword === '') {
            checkIcon.style.display = 'none';
            matchText.textContent = '';
            return;
        }

        if (password === confirmPassword) {
            checkIcon.style.display = 'inline';
            matchText.textContent = 'Senhas coincidem';
            matchText.style.color = '#43aa8b';
        } else {
            checkIcon.style.display = 'none';
            matchText.textContent = 'Senhas não coincidem';
            matchText.style.color = '#f94144';
        }
    }

    openModal(modalType) {
        this.closeModal();
        const modal = document.getElementById(modalType + 'Modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        
        // Limpar formulários
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
        this.updatePasswordStrength('');
        this.checkPasswordMatch();
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationIcon = notification.querySelector('.notification-icon');
        const notificationMessage = notification.querySelector('.notification-message');

        // Configurar ícone baseado no tipo
        notificationIcon.className = 'notification-icon';
        switch(type) {
            case 'success':
                notificationIcon.classList.add('fas', 'fa-check-circle');
                break;
            case 'error':
                notificationIcon.classList.add('fas', 'fa-exclamation-circle');
                break;
            case 'info':
                notificationIcon.classList.add('fas', 'fa-info-circle');
                break;
        }

        notificationMessage.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }
}

// Funções Globais
function loginWithGoogle() {
    authSystem.loginWithGoogle();
}

function signupWithGoogle() {
    authSystem.signupWithGoogle();
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function startStudying() {
    authSystem.showNotification('Redirecionando para a área de estudo...', 'info');
    // Aqui você pode redirecionar para a página de estudo
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const userInfo = document.querySelector('.user-info');
    
    if (!userInfo.contains(e.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Fechar modal ao clicar no X ou fora
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        authSystem.closeModal();
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            authSystem.closeModal();
        }
    });
});

// Alternar entre login e cadastro
document.querySelectorAll('.switch-to-signup').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        authSystem.closeModal();
        authSystem.openModal('signup');
    });
});

document.querySelectorAll('.switch-to-login').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        authSystem.closeModal();
        authSystem.openModal('login');
    });
});

// Fechar notificação
document.querySelector('.notification-close').addEventListener('click', () => {
    document.getElementById('notification').classList.add('hidden');
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        authSystem.closeModal();
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// Botões do header
document.getElementById('loginBtn').addEventListener('click', () => {
    authSystem.openModal('login');
});

document.getElementById('signupBtn').addEventListener('click', () => {
    authSystem.openModal('signup');
});

// Inicializar sistema
const authSystem = new AuthSystem();
// ... (todo o código anterior permanece até a classe AuthSystem) ...

// ADICIONE ESTAS NOVAS FUNÇÕES AO FINAL DO ARQUIVO:

// Função principal de redirecionamento
function redirectToFlashcards(section = '') {
    // Mostrar tela de carregamento
    showRedirectingScreen();
    
    // Simular um pequeno delay para a animação
    setTimeout(() => {
        // Aqui você coloca a URL do seu site de flashcards
        // Por enquanto, vou redirecionar para uma página de exemplo
        // Substitua pela URL real do seu site
        const baseUrl = 'https://exemplo-seu-site-flashcards.com';
        
        let redirectUrl = baseUrl;
        
        // Adicionar seção específica se fornecida
        if (section) {
            redirectUrl += `#${section}`;
        }
        
        // Adicionar informações do usuário (opcional)
        const user = authSystem.currentUser;
        if (user) {
            // Codificar informações do usuário para passar para o outro site
            const userData = btoa(JSON.stringify({
                id: user.id,
                name: user.firstName,
                email: user.email
            }));
            redirectUrl += `?user=${userData}`;
        }
        
        // Redirecionar para o site de flashcards
        window.location.href = redirectUrl;
        
    }, 2000); // 2 segundos de delay para mostrar a animação
}

// Função para mostrar tela de redirecionamento
function showRedirectingScreen() {
    const redirectingHTML = `
        <div class="redirecting" id="redirectingScreen">
            <div class="redirecting-spinner"></div>
            <h2>Redirecionando para o FlashStudy</h2>
            <p>Preparando sua experiência de estudo...</p>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', redirectingHTML);
}

// Função para redirecionar a partir do menu dropdown
function redirectToFlashcardsFromMenu(section = '') {
    redirectToFlashcards(section);
}

// Atualizar a função startStudying existente
function startStudying() {
    redirectToFlashcards();
}

// Adicionar evento ao item do menu dropdown
document.addEventListener('DOMContentLoaded', function() {
    // Isso será adicionado quando o dropdown for criado dinamicamente
});

// Função para simular redirecionamento (para teste)
// REMOVA ESTA FUNÇÃO QUANDO FOR USAR A URL REAL
function simulateRedirect() {
    showRedirectingScreen();
    
    setTimeout(() => {
        // Para teste, vamos mostrar uma mensagem em vez de redirecionar
        document.getElementById('redirectingScreen').remove();
        authSystem.showNotification('Redirecionamento simulado para o site de flashcards!', 'success');
        
        // Aqui você pode adicionar o código real de redirecionamento:
        // window.location.href = 'https://seu-site-real.com';
    }, 2000);
}

// ATUALIZE a função loginWithGoogle para redirecionar automaticamente após login
loginWithGoogle() {
    // ... (código anterior) ...
    
    // Adicionar redirecionamento automático
    setTimeout(() => {
        if (this.currentUser) {
            this.showNotification('Login realizado! Redirecionando...', 'success');
            setTimeout(() => {
                redirectToFlashcards();
            }, 1500);
        }
    }, 1000);
}

// MODIFIQUE a função handleLogin para redirecionar após login bem-sucedido
handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        this.showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }

    if (this.login(email, password)) {
        this.closeModal();
        this.showNotification('Login realizado! Redirecionando...', 'success');
        
        // Redirecionar após 1.5 segundos
        setTimeout(() => {
            redirectToFlashcards();
        }, 1500);
    }
}

// MODIFIQUE a função handleSignup para redirecionar após cadastro bem-sucedido
handleSignup() {
    const formData = {
        firstName: document.getElementById('signupFirstName').value,
        lastName: document.getElementById('signupLastName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('signupConfirmPassword').value
    };

    if (!this.validateSignup(formData)) {
        return;
    }

    if (this.signup(formData)) {
        this.closeModal();
        this.showNotification('Conta criada! Redirecionando...', 'success');
        
        // Redirecionar após 1.5 segundos
        setTimeout(() => {
            redirectToFlashcards();
        }, 1500);
    }
}

// ... (o restante do código permanece igual) ...