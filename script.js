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
        Telegram.WebApp.MainButton.setText("Charakter wählen").disable().show();
        selectionStatus.textContent = '';
    } else if (phase === 'scenario_selection') {
        scenarioSelectionDiv.style.display = 'block';
        Telegram.WebApp.MainButton.setText("Szenario wählen").disable().show();
        selectionStatus.textContent = '';
    }

    currentPhase = phase;
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

characterCards.forEach(card => {
    card.addEventListener('click', () => {
        characterCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCharacter = card.dataset.character;

        const names = {
            jane: "Jane",
            frau_grace: "Frau Grace",
            sakura: "Sakura",
            nya: "Nya"
        };

        const name = names[selectedCharacter] || "unbekannt";
        selectionStatus.textContent = `Du hast "${name}" gewählt! Klicke den Button unten, um fortzufahren.`;
        selectionStatus.style.color = Telegram.WebApp.themeParams.link_color || "#b76bf9";

        Telegram.WebApp.MainButton.setText(`Spiele als ${name}`).enable();
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
        selectionStatus.textContent = `Du hast "${name}" gewählt! Klicke den Button unten, um das Spiel zu starten.`;
        selectionStatus.style.color = Telegram.WebApp.themeParams.link_color || "#b76bf9";

        Telegram.WebApp.MainButton.setText(`Starte "${name}"`).enable();
    });
});

Telegram.WebApp.MainButton.onClick(() => {
    Telegram.WebApp.HapticFeedback.impactOccurred('medium');

    if (currentPhase === 'character_selection') {
        if (selectedCharacter) {
            showPhase('scenario_selection');
        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst einen Charakter aus!');
        }
    } else if (currentPhase === 'scenario_selection') {
        if (selectedScenario) {
            const gameData = {
                character: selectedCharacter,
                scenario: selectedScenario
            };
            Telegram.WebApp.sendData(JSON.stringify(gameData));
            Telegram.WebApp.close();
        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst ein Szenario aus!');
        }
    }
});

showPhase('character_selection');
Telegram.WebApp.MainButton.hide();

