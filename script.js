// Função para virar o card
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Função para navegar entre os cards
let currentCardIndex = 0;
const cards = document.querySelectorAll('.flashcard');

function nextCard() {
    cards[currentCardIndex].style.display = 'none';
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    cards[currentCardIndex].style.display = 'block';
}

function prevCard() {
    cards[currentCardIndex].style.display = 'none';
    currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    cards[currentCardIndex].style.display = 'block';
}

// Função para adicionar novo flashcard
function addFlashcard() {
    const pergunta = document.getElementById('pergunta').value;
    const resposta = document.getElementById('resposta').value;
    
    if (pergunta && resposta) {
        const flashcardsContainer = document.querySelector('.flashcards-container');
        
        const newCard = document.createElement('div');
        newCard.className = 'flashcard';
        newCard.onclick = function() { flipCard(this); };
        
        newCard.innerHTML = `
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <h3>${pergunta}</h3>
                    <p>Clique para ver a resposta</p>
                </div>
                <div class="flashcard-back">
                    <h3>Resposta:</h3>
                    <p>${resposta}</p>
                </div>
            </div>
        `;
        
        flashcardsContainer.insertBefore(newCard, document.querySelector('.flashcard-controls'));
        
        // Limpar o formulário
        document.getElementById('pergunta').value = '';
        document.getElementById('resposta').value = '';
        
        alert('Flashcard adicionado com sucesso!');
    } else {
        alert('Por favor, preencha tanto a pergunta quanto a resposta.');
    }
}

// Função para selecionar um baralho
function selectDeck(deckName) {
    alert(`Baralho "${deckName}" selecionado!`);
    // Aqui você implementaria a lógica para carregar os flashcards do baralho selecionado
}

// Função para criar novo baralho
function createNewDeck() {
    const deckName = prompt('Digite o nome do novo baralho:');
    if (deckName) {
        const decksContainer = document.querySelector('.decks-container');
        
        const newDeck = document.createElement('div');
        newDeck.className = 'deck-card';
        newDeck.onclick = function() { selectDeck(deckName); };
        
        newDeck.innerHTML = `
            <i class="fas fa-folder-plus"></i>
            <h3>${deckName}</h3>
            <p>0 flashcards</p>
        `;
        
        decksContainer.insertBefore(newDeck, decksContainer.lastElementChild);
        
        alert(`Baralho "${deckName}" criado com sucesso!`);
    }
}

// Função para mostrar seções
function showSection(sectionId) {
    // Esconder todas as seções principais
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar a seção solicitada
    document.getElementById(sectionId).style.display = 'block';
    
    // Scroll para a seção
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar a navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Mostrar apenas o primeiro card inicialmente
    if (cards.length > 0) {
        for (let i = 1; i < cards.length; i++) {
            cards[i].style.display = 'none';
        }
    }
});