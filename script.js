// DEBUG: Skriptstart protokollieren
console.log('script.js started.');

// 1. Initialisiere die Telegram Web App
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // App auf die volle Höhe erweitern

// DEBUG: Telegram Web App Status protokollieren
console.log('Telegram.WebApp is ready and expanded.');
console.log('Theme Params:', Telegram.WebApp.themeParams);


// 2. Hole dir Referenzen zu den HTML-Elementen
// Wir verwenden getElementById, wo IDs vergeben sind, da dies direkter ist
const characterGrid = document.getElementById('character-grid-container'); // ACHTUNG: Neue ID in HTML nötig!
const characterCards = document.querySelectorAll('.character-card');
const scenarioSelectionDiv = document.getElementById('scenario-selection-container'); // ACHTUNG: Neue ID in HTML nötig!
const scenarioCards = document.querySelectorAll('.scenario-card');
const selectionStatus = document.getElementById('selection-status');

// DEBUG: Überprüfen, ob Elemente gefunden wurden
if (!characterGrid) console.error('Error: characterGrid element not found!');
if (!scenarioSelectionDiv) console.error('Error: scenarioSelectionDiv element not found!');
if (!selectionStatus) console.error('Error: selectionStatus element not found!');
if (characterCards.length === 0) console.error('Error: No character cards found!');
if (scenarioCards.length === 0) console.error('Error: No scenario cards found!');


let selectedCharacter = null;
let selectedScenario = null;
let currentPhase = 'character_selection';


// Funktion, um die Anzeige der UI-Phasen zu wechseln
function showPhase(phase) {
    // Sicherstellen, dass die Elemente existieren, bevor wir auf style.display zugreifen
    if (characterGrid) characterGrid.style.display = 'none';
    if (scenarioSelectionDiv) scenarioSelectionDiv.style.display = 'none';

    if (phase === 'character_selection') {
        if (characterGrid) characterGrid.style.display = 'grid';
        Telegram.WebApp.MainButton.setText("Charakter wählen").disable();
        selectionStatus.textContent = '';
    } else if (phase === 'scenario_selection') {
        if (scenarioSelectionDiv) scenarioSelectionDiv.style.display = 'block';
        Telegram.WebApp.MainButton.setText("Szenario wählen").disable();
        selectionStatus.textContent = '';
    }
    currentPhase = phase;
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
    console.log('Switched to phase:', phase); // DEBUG
}


// --- Logik für die Charakterauswahl ---
characterCards.forEach(card => {
    card.addEventListener('click', () => {
        console.log('Character card clicked:', card.dataset.character); // DEBUG
        characterCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCharacter = card.dataset.character;

        let characterName = '';
        switch (selectedCharacter) {
            case 'jane': characterName = 'Jane'; break;
            case 'frau_grace': characterName = 'Frau Grace'; break;
            case 'sakura': characterName = 'Sakura'; break;
            case 'nya': characterName = 'Nya'; break;
            default: characterName = 'einen unbekannten Charakter'; break;
        }
        selectionStatus.textContent = `Du hast "${characterName}" gewählt! Klicke den Button unten, um fortzufahren.`;
        selectionStatus.style.color = Telegram.WebApp.themeParams.link_color || '#b76bf9';

        Telegram.WebApp.MainButton.setText(`Spiele als ${characterName}`).enable();
        Telegram.WebApp.MainButton.onClick(handleMainButtonClick);
    });
});

// --- Logik für die Szenario-Auswahl ---
scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
        console.log('Scenario card clicked:', card.dataset.scenario); // DEBUG
        scenarioCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedScenario = card.dataset.scenario;

        let scenarioName = '';
        switch (selectedScenario) {
            case 'mysterious_forest': scenarioName = 'Der uralte Fluch (Wald)'; break;
            case 'abandoned_castle': scenarioName = 'Das Echo des Königs (Burg)'; break;
            case 'bustling_city': scenarioName = 'Intrigen in der Metropole (Stadt)'; break;
            default: scenarioName = 'ein unbekanntes Szenario'; break;
        }
        selectionStatus.textContent = `Du hast "${scenarioName}" gewählt! Klicke den Button unten, um das Spiel zu starten.`;
        selectionStatus.style.color = Telegram.WebApp.themeParams.link_color || '#b76bf9';

        Telegram.WebApp.MainButton.setText(`Starte "${scenarioName}"`).enable();
        Telegram.WebApp.MainButton.onClick(handleMainButtonClick);
    });
});


// --- Handler für den MainButton-Klick (zentrale Logik) ---
function handleMainButtonClick() {
    Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    console.log('Main Button clicked in phase:', currentPhase); // DEBUG

    if (currentPhase === 'character_selection') {
        if (selectedCharacter) {
            showPhase('scenario_selection');
            Telegram.WebApp.MainButton.hide();
            Telegram.WebApp.MainButton.setText("Szenario wählen").disable().show();
        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst einen Charakter aus!');
        }
    } else if (currentPhase === 'scenario_selection') {
        if (selectedScenario) {
            const gameData = {
                character: selectedCharacter,
                scenario: selectedScenario
            };
            console.log('Sending data to bot:', gameData); // DEBUG
            Telegram.WebApp.sendData(JSON.stringify(gameData));
            Telegram.WebApp.close();
        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst ein Szenario aus!');
        }
    }
}

// Initialisiere die App-Anzeige (zeige zuerst die Charakterauswahl)
showPhase('character_selection');
Telegram.WebApp.MainButton.hide();
console.log('Initial phase set to character_selection.'); // DEBUG
