const { REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [
    {
      name: 'pannelloticket',
      description: 'Invia il pannello di creazione ticket'
    },
    {
      name: 'banna',
      description: 'Banna un utente dal server',
      options: [
        { type: 6, name: 'utente', description: 'Utente da bannare', required: true },
        { type: 3, name: 'motivo', description: 'Motivo del ban (opzionale)', required: false }
      ]
    },
    {
      name: 'espelli',
      description: 'Espelle un utente dal server',
      options: [
        { type: 6, name: 'utente', description: 'Utente da espellere', required: true },
        { type: 3, name: 'motivo', description: 'Motivo dell’espulsione (opzionale)', required: false }
      ]
    },
    {
      name: 'aggiorna-ruolo',
      description: 'Aggiungi o rimuovi un ruolo a un utente',
      options: [
        { type: 6, name: 'utente', description: 'Utente da modificare', required: true },
        { type: 8, name: 'ruolo', description: 'Ruolo da gestire', required: true },
        {
          type: 3,
          name: 'azione',
          description: 'Aggiungi o rimuovi il ruolo',
          required: true,
          choices: [
            { name: 'aggiungi', value: 'aggiungi' },
            { name: 'rimuovi', value: 'rimuovi' }
          ]
        },
        { type: 3, name: 'motivo', description: 'Motivo (opzionale)', required: false }
      ]
    },
    {
      name: 'clearall',
      description: 'Cancella tutti i messaggi in questo canale'
    },
    {
      name: 'clear',
      description: 'Cancella un numero specifico di messaggi con filtri opzionali',
      options: [
        { type: 4, name: 'quantità', description: 'Numero di messaggi da cancellare (1-100)', required: true },
        { type: 3, name: 'filtro', description: 'Filtro per i messaggi', required: false, choices: [
          { name: 'Tutti', value: 'tutti' },
          { name: 'Solo utente', value: 'utente' },
          { name: 'Solo bot', value: 'bot' }
        ] },
        { type: 6, name: 'utente', description: 'Utente da filtrare (solo se filtro = "utente")', required: false }
      ]
    },
    {
      name: 'messaggio',
      description: 'Invia un messaggio personalizzato nel canale corrente',
      options: [
        {
          type: 3,
          name: 'testo',
          description: 'Testo del messaggio da inviare',
          required: true
        }
      ]
    },

  {
  name: 'tempvoice',
  description: 'Crea una stanza vocale privata temporanea',
  options: [
    {
      type: 3,
      name: 'nome',
      description: 'Nome della stanza vocale (max 100 caratteri)',
      required: true,
      maxLength: 100
    },
    {
      type: 4,
      name: 'persone',
      description: 'Numero massimo di persone (1-10)',
      required: true,
      minValue: 1,
      maxValue: 10
    },
    {
      type: 3, // TEXT
      name: 'utenti',
      description: 'Menziona gli utenti autorizzati (es. @Matti @Giovanni)',
      required: false
    }
  ]
},
{
  name: 'embed',
  description: 'Crea un embed personalizzato nel canale corrente',
  options: [
    {
      type: 3,
      name: 'descrizione',
      description: 'Descrizione dell’embed (obbligatoria)',
      required: true,
      maxLength: 4096
    },
    {
      type: 3,
      name: 'titolo',
      description: 'Titolo dell’embed (opzionale)',
      required: false,
      maxLength: 256
    },
    {
      type: 3,
      name: 'colore',
      description: 'Colore esadecimale (es. ff5733) o nome (red, green, blue)',
      required: false
    },
    {
      type: 3,
      name: 'immagine',
      description: 'URL dell’immagine (opzionale)',
      required: false
    },
    {
      type: 3,
      name: 'thumbnail',
      description: 'URL della miniatura (opzionale)',
      required: false
    },
    {
      type: 3,
      name: 'footer',
      description: 'Testo del footer (opzionale)',
      required: false,
      maxLength: 2048
    }
  ]
},
{
  name: 'supporto',
  description: 'Mostra tutti i comandi disponibili del bot'
}];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⏳ Registrando comandi...');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('✅ Comandi registrati globalmente!');
  } catch (error) {
    console.error('❌ Errore nella registrazione dei comandi:', error);
  }
})();