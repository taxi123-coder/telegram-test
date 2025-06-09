Telegram.WebApp.ready();
Telegram.WebApp.expand();

const characterGrid = document.getElementById('character-grid-container');
const characterCards = document.querySelectorAll('.character-card');
const scenarioSelectionDiv = document.getElementById('scenario-selection-container');
const scenarioCards = document.querySelectorAll('.scenario-card');
const selectionStatus = document.getElementById('selection-status');

let selectedCharacter = null;
let selectedScenario = null;
let currentPhase = 'character_selection';

function showPhase(phase) {
    characterGrid.style.display = 'none';
    scenarioSelectionDiv.style.display = 'none';

    if (phase === 'character_selection') {
        characterGrid.style.display = 'grid';
        selectionStatus.textContent = '';
    } else if (phase === 'scenario_selection') {
        scenarioSelectionDiv.style.display = 'block';
        selectionStatus.textContent = '';
    }

    currentPhase = phase;
}

characterCards.forEach(card => {
    card.addEventListener('click', () => {
        characterCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCharacter = card.dataset.character;

        // Optional: Highlight welcher Charakter gewählt wurde
        const names = {
            jane: "Jane",
            frau_grace: "Frau Grace",
            sakura: "Sakura",
            nya: "Nya"
        };
        const name = names[selectedCharacter] || "unbekannt";
        console.log(`Charakter gewählt: ${name}`);

        // Direkt zur Szenario-Auswahl wechseln
        showPhase('scenario_selection');
    });
});

scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
        scenarioCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedScenario = card.dataset.scenario;

        const names = {
            mysterious_forest: "Der uralte Fluch (Wald)",
            abandoned_castle: "Das Echo des Königs (Burg)",
            bustling_city: "Intrigen in der Metropole (Stadt)"
        };
        const name = names[selectedScenario] || "unbekannt";

        // Direkt Spiel starten & Daten an Telegram schicken
        const gameData = {
            character: selectedCharacter,
            scenario: selectedScenario
        };
        console.log('Sende an Telegram:', gameData);
        Telegram.WebApp.sendData(JSON.stringify(gameData));
        Telegram.WebApp.close();
    });
});

// App startet mit Charakterauswahl
showPhase('character_selection');
