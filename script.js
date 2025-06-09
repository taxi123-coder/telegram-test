// 1. Initialisiere die Telegram Web App
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // App auf die volle Höhe erweitern

// 2. Hole dir Referenzen zu den HTML-Elementen
const characterCards = document.querySelectorAll('.character-card');
const selectionStatus = document.getElementById('selection-status');
let selectedCharacter = null; // Variable, um den aktuell ausgewählten Charakter zu speichern

// 3. Füge Event Listener zu den Charakterkarten hinzu
characterCards.forEach(card => {
    card.addEventListener('click', () => {
        // Entferne 'selected' Klasse von allen Karten
        characterCards.forEach(c => c.classList.remove('selected'));

        // Füge 'selected' Klasse zur geklickten Karte hinzu
        card.classList.add('selected');

        selectedCharacter = card.dataset.character; // Holt den Wert aus data-character

        // Zeige eine Bestätigung in der App an
        let characterName = '';
        switch (selectedCharacter) {
            case 'jane': characterName = 'Jane'; break;
            case 'frau_grace': characterName = 'Frau Grace'; break;
            case 'sakura': characterName = 'Sakura'; break;
            case 'nya': characterName = 'Nya'; break;
            default: characterName = 'einen unbekannten Charakter'; break;
        }
        selectionStatus.textContent = `Du hast "${characterName}" gewählt!`;
        selectionStatus.style.color = Telegram.WebApp.themeParams.link_color || '#b76bf9'; // Lila Akzentfarbe

        // Sende eine haptische Rückmeldung (leichte Vibration)
        Telegram.WebApp.HapticFeedback.impactOccurred('light');

        // Zeige den MainButton an und aktiviere ihn
        Telegram.WebApp.MainButton.setText(`Spiele als ${characterName}`).show();
        Telegram.WebApp.MainButton.enable(); // Sicherstellen, dass er aktiv ist
        Telegram.WebApp.MainButton.onClick(handleMainButtonClick); // Füge den Klick-Handler hinzu
    });
});

// Handler für den MainButton-Klick
function handleMainButtonClick() {
    if (selectedCharacter) {
        Telegram.WebApp.showAlert(`Starte das Spiel als ${selectedCharacter}!`);

        // Hier würde die Logik für den Übergang zum nächsten Schritt folgen:
        // - Wechsel zur Chat-Ansicht mit dem Charakter
        // - Senden der Auswahl an dein Backend, um die KI-Sitzung zu starten
        // Beispiel:
        // Telegram.WebApp.sendData(JSON.stringify({ action: 'start_game', character: selectedCharacter }));

        // Verstecke den MainButton, wenn die Aktion initiiert wurde
        Telegram.WebApp.MainButton.hide();

        // Optional: Deaktiviere die Charakterauswahl, wenn das Spiel startet
        characterCards.forEach(c => c.style.pointerEvents = 'none'); // Macht Karten nicht mehr klickbar
    } else {
        Telegram.WebApp.showAlert('Bitte wähle zuerst einen Charakter aus!');
    }
}

// Initialer Zustand des MainButtons: Versteckt oder deaktiviert
Telegram.WebApp.MainButton.hide();
// Oder wenn du ihn von Anfang an zeigen, aber deaktiviert haben möchtest:
// Telegram.WebApp.MainButton.setText("Wähle einen Charakter").show();
// Telegram.WebApp.MainButton.disable();
