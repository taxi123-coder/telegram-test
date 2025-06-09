// 1. Initialisiere die Telegram Web App
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // App auf die volle Höhe erweitern

// 2. Hole dir Referenzen zu den HTML-Elementen
const characterGrid = document.querySelector('.character-grid');
const characterCards = document.querySelectorAll('.character-card');
const scenarioSelectionDiv = document.querySelector('.scenario-selection');
const scenarioCards = document.querySelectorAll('.scenario-card');
const selectionStatus = document.getElementById('selection-status'); // Dies kann auch für Szenarien genutzt werden

let selectedCharacter = null;
let selectedScenario = null;

// Status-Variable, um zu verfolgen, in welcher Phase wir uns befinden (Charakter-Auswahl oder Szenario-Auswahl)
let currentPhase = 'character_selection'; // 'character_selection' oder 'scenario_selection'

// Funktion, um die Anzeige der UI-Phasen zu wechseln
function showPhase(phase) {
    characterGrid.style.display = 'none';
    scenarioSelectionDiv.style.display = 'none';

    if (phase === 'character_selection') {
        characterGrid.style.display = 'grid'; // Wichtig: display auf 'grid' setzen
        Telegram.WebApp.MainButton.setText("Charakter wählen").disable(); // Initial deaktiviert
        selectionStatus.textContent = ''; // Status zurücksetzen
    } else if (phase === 'scenario_selection') {
        scenarioSelectionDiv.style.display = 'block'; // Wichtig: display auf 'block' setzen
        Telegram.WebApp.MainButton.setText("Szenario wählen").disable(); // Initial deaktiviert
        selectionStatus.textContent = ''; // Status zurücksetzen
    }
    currentPhase = phase;
    Telegram.WebApp.HapticFeedback.impactOccurred('light'); // Leichte Vibration beim Phasenwechsel
}


// --- Logik für die Charakterauswahl ---
characterCards.forEach(card => {
    card.addEventListener('click', () => {
        characterCards.forEach(c => c.classList.remove('selected')); // Alle abwählen
        card.classList.add('selected'); // Aktuelle auswählen
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

        // Aktiviere den MainButton für den nächsten Schritt
        Telegram.WebApp.MainButton.setText(`Spiele als ${characterName}`).enable();
        Telegram.WebApp.MainButton.onClick(handleMainButtonClick); // Klick-Handler setzen
    });
});

// --- Logik für die Szenario-Auswahl ---
scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
        scenarioCards.forEach(c => c.classList.remove('selected')); // Alle abwählen
        card.classList.add('selected'); // Aktuelle auswählen
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

        // Aktiviere den MainButton für den Spielstart
        Telegram.WebApp.MainButton.setText(`Starte "${scenarioName}"`).enable();
        Telegram.WebApp.MainButton.onClick(handleMainButtonClick); // Klick-Handler neu setzen
    });
});


// --- Handler für den MainButton-Klick (zentrale Logik) ---
function handleMainButtonClick() {
    Telegram.WebApp.HapticFeedback.impactOccurred('medium'); // Stärkere Vibration

    if (currentPhase === 'character_selection') {
        if (selectedCharacter) {
            // Übergang zur Szenario-Auswahl
            showPhase('scenario_selection');
            Telegram.WebApp.MainButton.hide(); // Verstecke den Button kurz beim Übergang
            // Reset MainButton für Szenario-Auswahl phase
            Telegram.WebApp.MainButton.setText("Szenario wählen").disable().show();
        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst einen Charakter aus!');
        }
    } else if (currentPhase === 'scenario_selection') {
        if (selectedScenario) {
            // Spiel starten und App schließen
            const gameData = {
                character: selectedCharacter,
                scenario: selectedScenario
            };

            // Daten an den Bot senden (wichtig für den nächsten Schritt!)
            // Der Bot erhält diese Daten als Textnachricht
            Telegram.WebApp.sendData(JSON.stringify(gameData));

            // Optional: Kurze Bestätigung, dann App schließen
            // Telegram.WebApp.showAlert(`Spiel startet mit ${selectedCharacter} im Szenario ${selectedScenario}!`);
            // Setze einen kleinen Timeout, damit die Alert-Meldung gesehen werden kann
            // setTimeout(() => {
            //     Telegram.WebApp.close(); // Schliesst die Mini App
            // }, 1000); // 1 Sekunde Verzögerung
            
            // Sofort schließen, um schneller zum Bot zurückzukehren
            Telegram.WebApp.close(); // Schliesst die Mini App

        } else {
            Telegram.WebApp.showAlert('Bitte wähle zuerst ein Szenario aus!');
        }
    }
}

// Initialisiere die App-Anzeige (zeige zuerst die Charakterauswahl)
showPhase('character_selection');
Telegram.WebApp.MainButton.hide(); // Verstecke den MainButton zu Beginn, bis ein Charakter gewählt ist
