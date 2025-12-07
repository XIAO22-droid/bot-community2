const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: ['CHANNEL', 'MESSAGE', 'REACTION']
});
// (No change needed here, this is a correct closing bracket for an event handler)

// CONFIGURAZIONE PERSONALIZZABILE
const config = {
    botToken: process.env.BOT_TOKEN || 'MTQ0MzMxODc3OTY1MTI5MzIyNw.G3B6jl._Kr6bVl89dYY6m1IKuPqlpdrpX9hSSSShkHJ1Y', // 👈 IL TOKEN
    guildId: '1396077253313433672', // 👈 ID DEL SERVER
    categoryId: '1438277450432778292', // 👈 ID DELLA CATEGORIA DEI TICKET
    staffRoleId: '1443676530352853002', // 👈 ID DEL RUOLO STAFF
    supportChannelId: '1396090747786100746', // 👈 ID DEL CANALE DI SUPPORTO
    logModerationChannelId: '1443671969454231624', // 👈 ID DEL CANALE DI LOG DELLA MODERAZIONE
    logTicketChannelId: '1446918006499180624', // 👈 ID DEL CANALE DI LOG TICKET
    joinLeaveLogChannelId: '1446915770482163823', // 👈 ID DEL CANALE DI LOG DEI JOIN/LEAVE
    messageLogChannelId: '1446915934118740210',  // 👈 ID DEL CANALE DI LOG DEI MESSAGGI
    tempVoiceCategoryId: '1396091094256844921', // 👈 ID DELLA CATEGORIA PER I TEMPVOICE
    ticketPrefix: 'ticket-',
    embedColor: 0xFF5733,
    emojiCheck: '✅',
    emojiCross: '❌',
  welcomeDmEnabled: true, // 👈 abilita (true) / disabilita (false) il benvenuto in DM
  welcomeDmMessage: `**🎉 Benvenuto, {user}!** Grazie per esserti unito a **{server}**!\n\n📌 **Regole principali:**\n1. Rispetta tutti i membri\n2. No spam / flood\n3. Usa i canali corretti\n\n**🔗 Leggi le regole complete in <#1396083271032377456>**\n\n**Buon divertimento!** 🌴\n\n-# Se hai bisogno puoi contattare un nostro membro dello staff tramite un <#1396090747786100746>!\n*Grazie per la collabrorazione*`,
};

//--------------------
// PANNELLO TICKET   -
// -------------------
// const createInitialEmbed = () => {
//     return new EmbedBuilder()
//         .setTitle("Assistenza Sbibbi Community ❤️")
//         .setDescription(
//             `Clicca il pulsante se hai bisogno di assistenza via ticket.\n\n**N.B.**: Aprire un Ticket e non fornire alcuna risposta in esso per un tempo maggiore di 24h comporterà la chiusura automatica dello stesso.`
//         )
//         .addFields({
//             name: 'Vorresti un servizio più veloce?',
//             value: `*Assistenza Prioritaria Fa Al Caso Tuo! ${config.emojiCheck}*`
//         })
//         .setFooter({ text: "Assistenza S'S C. | By Sbibbi" })
//         .setThumbnail('https://sites.google.com/d/1iuZNBYfUK3yPnyuhdUDzeLWeRlRL2K5L/p/19tvYMKO0CtSwyISgLdIxdugA06Rf1TbD/edithttps://lh3.googleusercontent.com/sitesv/AAzXCkc4v8Wrg9vEdjIep2Xriyc-lGHJoJVhdazsUttxY74OVlWBwaKln59M7DoRklMXVRLlTKj4rPF3VxIqn4PugQrkRfTjbNjzyPwsj6H0f1-rDiMDOzElhagesXpvSSDfSneMMjd8Kwz2ImDR9FyvleI45cOgT6LbBzBfYHdcwGTEjyFnCg_r_WPFgKXbfj9KQIpYZ8FqnknDaGeeButnrMxwiCBWIujbEwvK=w1280') // Metti l'URL del tuo logo
//     .setColor(config.embedColor);
// };

// const createInitialButtons = () => {
// const createInitialButtons = () => {
//   return new ActionRowBuilder()
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId('open_ticket')
//         .setLabel('Apri un Ticket 🎫')
//         .setStyle(ButtonStyle.Danger),
//       new ButtonBuilder()
//         .setCustomId('priority_support')
//         .setLabel('Assistenza Prioritaria 💎')
//         .setStyle(ButtonStyle.Success)
//     );
// };
// MENU A SCOMPARSA (SELECT)
const createSelectMenu = () => {
  const options = [
    { label: 'Altro', value: 'altro', description: 'Per qualsiasi altra richiesta' },
    { label: 'Segnalazione Abuso', value: 'abuso', description: 'Segnala un membro' },
    { label: 'Problemi Tecnici', value: 'tecnico', description: 'Bug, crash, errori' },
    { label: 'Richiesta di Aiuto', value: 'rp', description: 'Aiuto con il ruolo o regole' }
  ];

  return new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_need')
        .setPlaceholder('Seleziona la tua Esigenza:')
        .addOptions(
        ...options.map(opt => new StringSelectMenuOptionBuilder()
          .setLabel(opt.label)
          .setValue(opt.value)
          .setDescription(opt.description)
        )
      )
    );
};

// EMBED DI BENVENUTO NEL TICKET
const createTicketWelcomeEmbed = (user, category) => {
  return new EmbedBuilder()
    .setTitle(`Benvenuto nell'Assistenza di Sbibbi Community 🏝️`)
    .setDescription(`Qui potrai trovare supporto in base al tuo problema.`)
    .addFields(
      { name: 'Utente:', value: `${user}`, inline: true },
      { name: 'Categoria:', value: `${category}`, inline: true }
    )
    .setFooter({ text: 'Assistenza Sbibbi Community • Oggi alle ' + new Date().toLocaleTimeString() })
    .setColor(config.embedColor);
};

// const createCloseEmbed = (user, reason) => {
//   return new EmbedBuilder()
// const createCloseEmbed = (user, reason) => {
//   return new EmbedBuilder()
//     .setTitle('Ticket Chiuso')
//     .setDescription(`${user} ha chiuso il ticket.`)
//     .addFields({ name: 'Motivo:', value: reason || 'Nessun motivo specificato.' })
//     .setFooter({ text: 'Assistenza  Sbibbi Community  | By Sbibbi' })
//     .setColor(0x555555);
// };
// (moved single ready handler to the async one later in the file)

// GESTIONE DEI PULSANTI
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const { customId, user, channel } = interaction;

  // APRI TICKET
  if (customId === 'open_ticket') {
    await interaction.deferReply({ ephemeral: true });

    // Simplify existing ticket check to avoid depending on permission bitfield internals
    const existingTicket = channel.guild.channels.cache.find(ch =>
      ch.name.startsWith(config.ticketPrefix) && ch.parentId === config.categoryId &&
      ch.permissionOverwrites.cache.some(perm => perm.id === user.id)
    );

    if (existingTicket) {
      return interaction.editReply({ content: 'Hai già un ticket aperto!', ephemeral: true });
    }

    try {
      const ticketChannel = await channel.guild.channels.create({
        name: `${config.ticketPrefix}${user.username.toLowerCase().replace(/\s+/g, '-')}`,
        type: 0, // TextChannel
        parent: config.categoryId,
        permissionOverwrites: [
          {
            id: channel.guild.roles.everyone,
            deny: ['ViewChannel']
          },
          {
            id: user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: config.staffRoleId,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages']
          }
        ]
      });

      const welcomeEmbed = createTicketWelcomeEmbed(user, 'Generale');
      const selectMenu = createSelectMenu();
      const closeButton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Chiudi 🔒')
            .setStyle(ButtonStyle.Danger)
        );

      await ticketChannel.send({
        content: `<@${user.id}>`,
        embeds: [welcomeEmbed],
        components: [selectMenu, closeButton]
      });

      await interaction.editReply({
        content: `✅ Ticket aperto: ${ticketChannel}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'Errore durante la creazione del ticket.', ephemeral: true });
    }

  } else if (customId === 'priority_support') {
    // ASSISTENZA PRIORITARIA (OPZIONALE)
    await interaction.reply({
      content: "📢 Per Avere L'assistenza Prioritaria Parla Con **Sbibbi/Met** 📢. *Grazie della collaborazione!*",
      ephemeral: true
    });
  }
});

// GESTIONE DEL MENU A SCOMPARSA
client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  const { customId, values, user, channel } = interaction;

  // Only handle the specific select menu
  if (customId !== 'select_need') return;

  const selectedValue = values[0];
  const categoryNames = {
    altro: 'Altro',
    tecnico: 'Problemi Tecnici',
    rp: 'Richiesta di Aiuto RP',
    abuso: 'Segnalazione Abuso'
  };

  // Crea il pulsante "Chiudi"
  const closeButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Chiudi 🔒')
        .setStyle(ButtonStyle.Danger)
    );

  // Aggiorna il messaggio con il testo e il pulsante (use mention by id)
  await interaction.update({
    content: `<@${user.id}> **Hai Selezionato: ${categoryNames[selectedValue] || 'Altro'}**`,
    embeds: [],
    components: [closeButton]
  });

  // Fetch the most recent message from the channel to ensure we have the message that holds the embed
  const fetchedMessages = await channel.messages.fetch({ limit: 1 }).catch(() => null);
  const messageInChannel = fetchedMessages?.first() ?? channel.messages.cache.first();
  const rawEmbed = messageInChannel?.embeds?.[0];

  if (!rawEmbed) return;

  // Build a fresh embed from the raw embed data and update the fields
  const updatedEmbed = new EmbedBuilder(rawEmbed.data ?? rawEmbed)
    .setTitle(`Benvenuto nell'Assistenza di Sbibbi Community 🏝️`)
    .setDescription(`Qui potrai trovare supporto in base al tuo problema.`)
    .setFields(
      { name: 'Utente:', value: `<@${user.id}>`, inline: true },
      { name: 'Categoria:', value: `${categoryNames[selectedValue] || 'Altro'}`, inline: true }
    )
    .setFooter({ text: 'Assistenza Sbibbi Community • Oggi alle ' + new Date().toLocaleTimeString() })
    .setColor(config.embedColor);

  // Invia l'embed aggiornato + il pulsante "Chiudi"
  await messageInChannel.edit({
    embeds: [updatedEmbed],
    components: [closeButton]
  });
});

// GESTIONE CHIUSURA TICKET
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const { customId, user, channel } = interaction;

  if (customId === 'close_ticket') {
  await interaction.deferReply({ ephemeral: true });

  if (!channel.name.startsWith(config.ticketPrefix)) {
    return interaction.editReply({ content: 'Questo non è un ticket!', ephemeral: true });
  }

  // Richiedi motivo di chiusura
  await interaction.editReply({
    content: '📝 Per favore, spiega brevemente il motivo della chiusura:',
    ephemeral: true
  });

  const filter = m => m.author.id === user.id;
  let collector; // 👈 DEFINITO QUI

  try {
    collector = channel.createMessageCollector({ filter, max: 1, time: 60000 });
  } catch (error) {
    console.error('Errore nella creazione del collector:', error);
    return interaction.editReply({ content: '❌ Impossibile avviare la raccolta del motivo.', ephemeral: true });
  }

  collector.on('collect', async msg => {
    const reason = msg.content || 'Nessun motivo specificato.';
    await msg.delete();

    // Blocca il canale all'utente
    await channel.permissionOverwrites.edit(user.id, { ViewChannel: false, SendMessages: false });

    // Invia messaggio con timer
    let timerMsg;
    try {
      timerMsg = await channel.send('🔒 Il ticket verrà eliminato tra **10** secondi...');
    } catch (error) {
      console.error('Errore nell\'invio del messaggio timer:', error);
      return interaction.editReply({ content: '❌ Impossibile inviare il timer.', ephemeral: true });
    }

    // Log embed
    const ticketId = parseInt(channel.name.replace(config.ticketPrefix, '').split('-')[0], 10) || 161;
    const logEmbed = new EmbedBuilder()
      .setTitle('Ticket Closed')
      .setColor(0x00FF7F)
      .addFields(
        { name: '🎟️ Ticket ID', value: `${ticketId}`, inline: true },
        { name: '✅ Opened By', value: `<@${user.id}>`, inline: true },
        { name: '🔒 Closed By', value: `<@${interaction.user.id}>`, inline: true },
        { name: '🕒 Open Time', value: `<t:${Math.floor(new Date(channel.createdTimestamp).getTime() / 1000)}:f>`, inline: true },
        { name: '👤 Claimed By', value: 'Non reclamato', inline: true },
        { name: '❓ Reason', value: reason, inline: false },
        { name: '⏱️ Close Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
      )
      .setFooter({ text: `Ticket ${ticketId} | ${channel.guild.name}` })
      .setTimestamp();

    // Invia log nel canale di log (se configurato)
    const logChannel = channel.guild.channels.cache.get(config.logTicketChannelId);
    if (logChannel && logChannel.isTextBased()) {
      try {
        await logChannel.send({ embeds: [logEmbed] });
      } catch (error) {
        console.error('Errore nell\'invio del log:', error);
      }
    }

    // TIMER ALLA ROVESCIA
    let seconds = 10;
    const countdown = setInterval(async () => {
      seconds--;
      if (seconds > 0) {
        try {
          await timerMsg.edit(`🔒 Il ticket verrà eliminato tra **${seconds}** secondi...`);
        } catch (e) {
          clearInterval(countdown);
        }
      } else {
        clearInterval(countdown);
        try {
          await timerMsg.edit('🗑️ Eliminazione del ticket in corso...');
          await channel.delete();
        } catch (e) {
          // Canale già eliminato o altro errore
        }
      }
    }, 1000);

    await interaction.editReply({
      content: '✅ Ticket chiuso e timer avviato.',
      ephemeral: true
    });

  });

  collector.on('end', async collected => {
    if (collected.size === 0) {
      // Nessuna risposta → chiudi senza motivo
      await channel.permissionOverwrites.edit(user.id, { ViewChannel: false, SendMessages: false });

      let timerMsg;
      try {
        timerMsg = await channel.send('🔒 Il ticket verrà eliminato tra ||**10**|| secondi...');
      } catch (error) {
        console.error('Errore nell\'invio del messaggio timer (nessun motivo):', error);
        return interaction.editReply({ content: '❌ Impossibile inviare il timer.', ephemeral: true });
      }

      const ticketId = parseInt(channel.name.replace(config.ticketPrefix, '').split('-')[0], 10) || 161;
      const logEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setColor(0x00FF7F)
        .addFields(
          { name: '🎟️ Ticket ID', value: `${ticketId}`, inline: true },
          { name: '✅ Opened By', value: `<@${user.id}>`, inline: true },
          { name: '🔒 Closed By', value: `<@${interaction.user.id}>`, inline: true },
          { name: '🕒 Open Time', value: `<t:${Math.floor(new Date(channel.createdTimestamp).getTime() / 1000)}:f>`, inline: true },
          { name: '👤 Owner Ticket', value: 'Sbibbi', inline: true },
          { name: '🗣️ Reason', value: 'Nessun motivo specificato.', inline: false },
          { name: '⏱️ Close Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
        )
        .setFooter({ text: `Ticket ${ticketId} | ${channel.guild.name}` })
        .setTimestamp();
      
          await interaction.editReply({
          content: `❓ Doamnde relative al ticket? Chiedi a Sbibbi!`,
          ephemeral: true
        
        });
      const logChannel = channel.guild.channels.cache.get(config.logTicketChannelId);
      if (logChannel && logChannel.isTextBased()) {
        try {
          await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
          console.error('Errore nell\'invio del log (nessun motivo):', error);
        }
      }

      // TIMER
      let seconds = 10;
      const countdown = setInterval(async () => {
        seconds--;
        if (seconds > 0) {
          try {
            await timerMsg.edit(`🔒 Il ticket verrà eliminato tra ||**${seconds}**|| secondi...`);
          } catch (e) {
            clearInterval(countdown);
          }
        } else {
          clearInterval(countdown);
          try {
            await timerMsg.edit('🗑️ Eliminazione del ticket in corso...');
            await channel.delete();
          } catch (e) {
            // Canale già eliminato
          }
        }
      }, 1000);
    }
  });
}});

// INVIA IL MENU INIZIALE (SOLO UNA VOLTA)
  // Opzionale: invia una sola volta e fissa il messaggio
// INVIA IL MENU INIZIALE (SOLO UNA VOLTA)
// This logic was moved into the async ready handler below so that awaits run inside an async function.
client.on('interactionCreate', async interaction => { // 👈 AGGIUNGI "async" QUI!
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'pannelloticket') {
    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Assistenza IPRP ❤️')
      .setDescription(`Clicca il pulsante se hai bisogno di assistenza via ticket.\n\n**N.B.**: Aprire un Ticket e non fornire alcuna risposta in esso per un tempo maggiore di 24h comporterà la chiusura automatica dello stesso.`)
      .addFields({
        name: 'Vorresti un servizio più veloce?',
        value: `[Assistenza Prioritaria ✅](https://example.com)`
      })
      .setFooter({ text: 'Assistenza IPRP | By Tommy' })
      .setThumbnail('https://i.imgur.com/...png')
      .setColor(0xFF5733);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('Apri un Ticket 🎫')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('priority_support')
          .setLabel('Assistenza Prioritaria 💎')
          .setStyle(ButtonStyle.Success)
      );

    await interaction.editReply({
      content: '✅ Pannello ticket inviato!',
      embeds: [embed],
      components: [row]
    });

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 60000);
  }
}); 

// ================================
// 👮 COMANDI MODERAZIONE
// ================================

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, user, guild } = interaction;

  // 🔒 CONTROLLO PERMESSI: solo staff
  const staffRole = interaction.guild.roles.cache.get(config.staffRoleId);
  if (!staffRole || !interaction.member.roles.cache.has(config.staffRoleId)) {
    return interaction.reply({
      content: '❌ Non hai il permesso di usare questo comando.',
      ephemeral: true
    });
  };

  // --------------------
// 🚫 COMANDO /banna (AGGIORNATO CON DM + DURATA + PERSONALIZZATO)
// --------------------
if (commandName === 'banna') {
  const target = options.getUser('utente');
  const durationChoice = options.getString('durata'); // 👈 Ora è obbligatoria e viene prima
  const reason = options.getString('motivo') || 'Nessun motivo specificato.';
  if (!target) {
    return interaction.reply({ content: '❌ Specifica un utente da bannare.', ephemeral: true });
  }
  if (target.id === user.id) {
    return interaction.reply({ content: '❌ Non puoi bannare te stesso!', ephemeral: true });
  }
  if (target.id === client.user.id) {
    return interaction.reply({ content: '❌ Non posso bannare me stesso!', ephemeral: true });
  }
  if (guild.ownerId === target.id) {
    return interaction.reply({ content: '❌ Non puoi bannare il proprietario del server!', ephemeral: true });
  }

  // Deferisco subito per avere tempo
  await interaction.deferReply({ ephemeral: true });

  // Gestione durata personalizzata
  let durationMs = 0;
  let durationDisplay = 'Permanente';
  if (durationChoice === 'personalizzato') {
    // Chiedi la durata personalizzata
    await interaction.editReply({
      content: '📝 Inserisci la durata del ban (es. `2h`, `30m`, `5d`):\n- `m` = minuti\n- `h` = ore\n- `d` = giorni',
      ephemeral: true
    });

    const filter = m => m.author.id === user.id;
    try {
      const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      const input = collected.first().content.trim().toLowerCase();
      collected.first().delete().catch(() => {});

      // Parser durata
      const match = input.match(/^(\d+)([mhd])$/);
      if (!match) {
        return interaction.editReply({ content: '❌ Formato durata non valido! Usa es. `30m`, `2h`, `5d`.', ephemeral: true });
      }

      const amount = parseInt(match[1]);
      const unit = match[2];
      if (unit === 'm') durationMs = amount * 60 * 1000;
      else if (unit === 'h') durationMs = amount * 60 * 60 * 1000;
      else if (unit === 'd') durationMs = amount * 24 * 60 * 60 * 1000;
      else return interaction.editReply({ content: '❌ Unità non valida. Usa `m`, `h` o `d`.', ephemeral: true });

      durationDisplay = input;
    } catch (e) {
      return interaction.editReply({ content: '⏰ Tempo scaduto. Usa il comando di nuovo.', ephemeral: true });
    }
  } else {
    // Durata predefinita
    switch (durationChoice) {
      case '1h': durationMs = 1 * 60 * 60 * 1000; durationDisplay = '1 ora'; break;
      case '6h': durationMs = 6 * 60 * 60 * 1000; durationDisplay = '6 ore'; break;
      case '1d': durationMs = 24 * 60 * 60 * 1000; durationDisplay = '1 giorno'; break;
      case '3d': durationMs = 3 * 24 * 60 * 60 * 1000; durationDisplay = '3 giorni'; break;
      case '7d': durationMs = 7 * 24 * 60 * 60 * 1000; durationDisplay = '7 giorni'; break;
      case 'permanente':
      default:
        durationMs = 0;
        durationDisplay = 'Permanente';
    }
  }

  try {
    // 📩 Invio DM all'utente
    const dmEmbed = new EmbedBuilder()
      .setTitle(durationMs > 0 ? '🔨 Sei stato bannato temporaneamente' : '🔨 Sei stato bannato permanentemente')
      .setDescription(`Sei stato bannato dal server **${guild.name}**.`)
      .addFields(
        { name: '👮 Moderatore', value: `<@${user.id}> (${user.tag})`, inline: true },
        { name: '📝 Motivo', value: reason, inline: true },
        { name: '⏰ Durata', value: durationMs > 0 ? `<t:${Math.floor((Date.now() + durationMs) / 1000)}:F>` : 'Permanente', inline: true }
      )
      .setFooter({ text: `Server: ${guild.name} • ${new Date().toLocaleString()}` })
      .setColor(durationMs > 0 ? 0xff5733 : 0xff0000);

    // Invia il DM (ignora errori se DM chiusi)
    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (dmErr) {
      console.warn(`⚠️ Impossibile inviare DM a ${target.tag}: ${dmErr.message}`);
    }

    // 🔨 Esegui il ban
    await guild.members.ban(target.id, {
      reason: `${reason} | Ban durata: ${durationDisplay}`,
      deleteMessageDays: 0
    });

    // 📢 Embed di conferma per lo staff
    const banEmbed = new EmbedBuilder()
      .setTitle('🔨 Utente Bannato')
      .setColor(0xff0000)
      .addFields(
        { name: 'Utente', value: `${target} (${target.tag})`, inline: true },
        { name: 'Moderatore', value: `${user} (${user.tag})`, inline: true },
        { name: 'Motivo', value: reason },
        { name: 'Durata', value: durationDisplay }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [banEmbed] });

    // 🔔 Log nel canale di moderazione
    const logChannel = guild.channels.cache.get(config.logModerationChannelId);
    if (logChannel?.isTextBased?.()) {
      await logChannel.send({ embeds: [banEmbed] });
    }

  } catch (error) {
    console.error('Errore in /banna:', error);
    await interaction.editReply({
      content: `❌ Impossibile bannare ${target.tag}. Probabilmente ha un ruolo superiore o mancano i permessi.`,
      ephemeral: true
    });
  }
};

  // --------------------
  // 🚪 COMANDO /espelli
  // --------------------
  if (commandName === 'espelli') {
    const target = options.getMember('utente');
    const reason = options.getString('motivo') || 'Nessun motivo specificato.';

    if (!target) {
      return interaction.reply({ content: '❌ Specifica un utente da espellere.', ephemeral: true });
    }

    if (target.id === user.id) {
      return interaction.reply({ content: '❌ Non puoi espellere te stesso!', ephemeral: true });
    }

    if (target.id === client.user.id) {
      return interaction.reply({ content: '❌ Non posso espellere me stesso!', ephemeral: true });
    }

    if (guild.ownerId === target.id) {
      return interaction.reply({ content: '❌ Non puoi espellere il proprietario del server!', ephemeral: true });
    }

    try {
      await target.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setTitle('🚪 Utente Espulso')
        .setColor(0xffa500)
        .addFields(
          { name: 'Utente', value: `${target} (${target.user.tag})`, inline: true },
          { name: 'Moderatore', value: `${user} (${user.tag})`, inline: true },
          { name: 'Motivo', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [kickEmbed] });

      // Opzionale: log
      const logChannel = guild.channels.cache.get('ID_CANALE_LOG_MOD');
      if (logChannel) logChannel.send({ embeds: [kickEmbed] });

    } catch (error) {
      console.error('Errore in /espelli:', error);
      await interaction.reply({ content: `❌ Impossibile espellere ${target.user.tag}. Probabilmente ha un ruolo superiore o mancano i permessi.`, ephemeral: true });
    }
  };

  // --------------------
  // 🔓 COMANDO /sban
  // --------------------
  if (commandName === 'sban') {
    const target = options.getUser('utente');
    const reason = options.getString('motivo') || 'Nessun motivo specificato.';
    if (!target) {
      return interaction.reply({ content: '❌ Specifica un utente da sbannare.', ephemeral: true });
    }
    if (target.id === user.id) {
      return interaction.reply({ content: '❌ Non puoi sbannare te stesso!', ephemeral: true });
    }
    if (target.id === client.user.id) {
      return interaction.reply({ content: '❌ Non posso sbannare me stesso!', ephemeral: true });
    }

    try {
      // Verifica se l'utente è bannato
      const bannedUsers = await guild.bans.fetch();
      if (!bannedUsers.has(target.id)) {
        return interaction.reply({ content: '❌ Questo utente non è bannato!', ephemeral: true });
      }

      // Sbanna
      await guild.members.unban(target.id, reason);

      // Embed di conferma
      const unbanEmbed = new EmbedBuilder()
        .setTitle('🔓 Utente Sbannato')
        .setColor(0x00ff00)
        .addFields(
          { name: 'Utente', value: `${target.tag} (\`${target.id}\`)`, inline: true },
          { name: 'Moderatore', value: `${user} (${user.tag})`, inline: true },
          { name: 'Motivo', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [unbanEmbed] });

      // 🔔 Log nel canale di moderazione
      const logChannel = guild.channels.cache.get(config.logModerationChannelId);
      if (logChannel?.isTextBased?.()) {
        await logChannel.send({ embeds: [unbanEmbed] });
      }
    } catch (error) {
      console.error('Errore in /sban:', error);
      let msg = '❌ Impossibile sbannare l’utente.';
      if (error.code === 50013) {
        msg += '\nIl bot non ha il permesso **"Sbanna membri"**.';
      } else if (error.message?.includes('Unknown Ban')) {
        msg = '❌ L’utente non risulta bannato.';
      }
      await interaction.reply({ content: msg, ephemeral: true });
    }
  };

  // ------------------------
  // 📌 COMANDO /aggiorna-ruolo
  // ------------------------
  if (commandName === 'aggiorna-ruolo') {
    const target = options.getMember('utente');
    const role = options.getRole('ruolo');
    const action = options.getString('azione'); // 'aggiungi' o 'rimuovi'
    const reason = options.getString('motivo') || 'Nessun motivo specificato.';

    if (!target || !role) {
      return interaction.reply({ content: '❌ Specifica utente, ruolo e azione.', ephemeral: true });
    }

    if (target.id === user.id && action === 'rimuovi') {
      return interaction.reply({ content: '❌ Non puoi rimuoverti un ruolo da solo!', ephemeral: true });
    }

    // Controllo gerarchia ruoli
    const botMember = guild.members.me;
    if (role.position >= botMember.roles.highest.position) {
      return interaction.reply({ content: '❌ Non posso gestire un ruolo uguale o superiore al mio!', ephemeral: true });
    }

    try {
      let success = false;
      if (action === 'aggiungi') {
        if (target.roles.cache.has(role.id)) {
          return interaction.reply({ content: '❌ L’utente ha già questo ruolo!', ephemeral: true });
        }
        await target.roles.add(role);
        success = true;
      } else if (action === 'rimuovi') {
        if (!target.roles.cache.has(role.id)) {
          return interaction.reply({ content: '❌ L’utente non ha questo ruolo!', ephemeral: true });
        }
        await target.roles.remove(role);
        success = true;
      }

      if (success) {
        const roleEmbed = new EmbedBuilder()
          .setTitle(`🎭 Ruolo ${action === 'aggiungi' ? 'Assegnato' : 'Rimosso'}`)
          .setColor(action === 'aggiungi' ? 0x00ff00 : 0xff0000)
          .addFields(
            { name: 'Utente', value: `${target} (${target.user.tag})`, inline: true },
            { name: 'Ruolo', value: `${role}`, inline: true },
            { name: 'Azione', value: action === 'aggiungi' ? 'Assegnato' : 'Rimosso', inline: true },
            { name: 'Moderatore', value: `${user} (${user.tag})`, inline: true },
            { name: 'Motivo', value: reason }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [roleEmbed] });

        // Opzionale: log
        const logChannel = guild.channels.cache.get('ID_CANALE_LOG_MOD');
        if (logChannel) logChannel.send({ embeds: [roleEmbed] });
      }

    } catch (error) {
      console.error('Errore in /aggiorna-ruolo:', error);
      await interaction.reply({ content: `❌ Impossibile modificare il ruolo. Probabilmente mancano i permessi.`, ephemeral: true });
    }
  }
});

// ================================
// 🧹 COMANDI DI PULIZIA MESSAGGI
// ================================

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, user, guild } = interaction;

  // 🔒 CONTROLLO PERMESSI: solo staff
  const staffRole = interaction.guild.roles.cache.get(config.staffRoleId);
  if (!staffRole || !interaction.member.roles.cache.has(config.staffRoleId)) {
    return interaction.reply({
      content: '❌ Non hai il permesso di usare questo comando.',
      ephemeral: true
    });
  }

  // --------------------
  // 🗑️ COMANDO /clearall
  // --------------------
if (commandName === 'clearall') {
  const channel = interaction.channel; // 👈 DEFINISCI IL CANALE DALL'INTERAZIONE

  try {
    // Verifica che il canale sia di testo
    if (!channel.isTextBased()) {
      return interaction.reply({
        content: '❌ Questo comando funziona solo in canali di testo.',
        ephemeral: true
      });
    }

    await channel.bulkDelete(100, true);
    let deletedCount = 0;
    let lastMessageId = null;

    do {
      const messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
      if (messages.size === 0) break;

      const toDelete = messages.filter(msg => !msg.pinned && msg.createdTimestamp > Date.now() - 14 * 24 * 60 * 60 * 1000);
      if (toDelete.size > 0) {
        await channel.bulkDelete(toDelete, true);
        deletedCount += toDelete.size;
      }

      if (messages.size < 100) break;
      lastMessageId = messages.last().id;

    } while (true);

    const embed = new EmbedBuilder()
      .setTitle('🧹 Messaggi cancellati')
      .setDescription(`Sono stati cancellati **${deletedCount}** messaggi in questo canale.`)
      .setColor(0x00ff00)
      .setFooter({ text: `Richiesto da ${user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

  } catch (error) {
    console.error('Errore in /clearall:', error);
    await interaction.reply({
      content: '❌ Impossibile cancellare tutti i messaggi. Assicurati che il bot abbia i permessi e che i messaggi non siano troppo vecchi.',
      ephemeral: true
    });
  }
}

  // --------------------
  // 🗑️ COMANDO /clear
  // --------------------
  if (commandName === 'clear') {
  const channel = interaction.channel; // 👈 DEFINISCI IL CANALE

  if (!channel.isTextBased()) {
    return interaction.reply({
      content: '❌ Questo comando funziona solo in canali di testo.',
      ephemeral: true
    });
  }

  const amount = options.getInteger('quantità');
  const filter = options.getString('filtro') || 'tutti';

  if (amount < 1 || amount > 100) {
    return interaction.reply({
      content: '❌ Specifica un numero tra 1 e 100.',
      ephemeral: true
    });
  }

  try {
    // Fetch dei messaggi (includi il comando stesso, poi lo filtriamo)
    let messages = await channel.messages.fetch({ limit: amount + 1 });
    messages = messages.filter(msg => !msg.pinned && msg.id !== interaction.id); // Escludi il comando

    if (filter === 'utente') {
      const targetUser = options.getUser('utente');
      if (!targetUser) {
        return interaction.reply({
          content: '❌ Specifica un utente da filtrare.',
          ephemeral: true
        });
      }
      messages = messages.filter(msg => msg.author.id === targetUser.id);
    }

    if (filter === 'bot') {
      messages = messages.filter(msg => msg.author.bot);
    }

    if (messages.size === 0) {
      return interaction.reply({
        content: '❌ Nessun messaggio trovato da cancellare con questi criteri.',
        ephemeral: true
      });
    }

    // Limite massimo 100 messaggi
    const messagesToDelete = messages.size > 100 ? messages.first(100) : messages;
    await channel.bulkDelete(messagesToDelete, true);

    const embed = new EmbedBuilder()
      .setTitle('🧹 Messaggi cancellati')
      .setDescription(`Sono stati cancellati **${messagesToDelete.size}** messaggi ${filter !== 'tutti' ? `(${filter})` : ''}.`)
      .setColor(0x00ff00)
      .setFooter({ text: `Richiesto da ${user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

  } catch (error) {
    console.error('Errore in /clear:', error);
    await interaction.reply({
      content: '❌ Impossibile cancellare i messaggi. Assicurati che:\n- Il bot abbia **Gestisci Messaggi**\n- I messaggi non siano più vecchi di 14 giorni',
      ephemeral: true
    });
  }
}
});

// ================================
// 💌 MESSAGGIO DI BENVENUTO IN DM
// ================================

client.on('guildMemberAdd', async member => {
  if (!config.welcomeDmEnabled || member.user.bot) return;

  try {
    // Sostituisce {user} con la menzione e {server} con il nome del server
    const message = config.welcomeDmMessage
      .replace(/{user}/g, member.user.toString())     // 👈 menzione completa: <@ID>
      .replace(/{server}/g, member.guild.name);

    await member.user.send(message);
    console.log(`✅ Messaggio di benvenuto inviato a ${member.user.tag}`);
  } catch (error) {
    console.warn(`⚠️ Impossibile inviare DM a ${member.user.tag}: ${error.message}`);
    
    // Opzionale: log in canale
    const logChannel = member.guild.channels.cache.get(config.logModerationChannelId);
    if (logChannel?.isTextBased()) {
      await logChannel.send(`⚠️ Impossibile inviare DM a ${member.user} (ha le DM chiuse).`);
    }
  }
  // manuale
  if (commandName === 'messaggiodmb') {
  await interaction.deferReply({ ephemeral: true });

  // 🔒 Controllo permessi (solo staff)
  const staffRole = interaction.guild.roles.cache.get(config.staffRoleId);
  if (!staffRole || !interaction.member.roles.cache.has(config.staffRoleId)) {
    return interaction.editReply({
      content: '❌ Non hai il permesso di usare questo comando.',
      ephemeral: true
    });
  }

  const utente = interaction.options.getUser('utente');
  if (!utente) {
    return interaction.editReply({
      content: '❌ Specifica un utente valido.',
      ephemeral: true
    });
  }

  // ✉️ Personalizza qui il messaggio di benvenuto
  const messaggioBenvenuto = `**🎉 Benvenuto, {user}!** Grazie per esserti unito a **{server}**!\n\n📌 **Regole principali:**\n1. Rispetta tutti i membri\n2. No spam / flood\n3. Usa i canali corretti\n\n**🔗 Leggi le regole complete in <#1396083271032377456>**\n\n**Buon divertimento!** 🌴\n\n-# Se hai bisogno puoi contattare un nostro membro dello staff tramite un <#1396090747786100746>!\n*Grazie per la collabrorazione*`;

  try {
    // Invia il messaggio in DM
    await utente.send(messaggioBenvenuto);

    // Feedback al comando
    await interaction.editReply({
      content: `✅ Messaggio di benvenuto inviato con successo a ${utente.tag}!`,
      ephemeral: true
    });
  } catch (error) {
    console.error('Errore durante l’invio del DM:', error);
    await interaction.editReply({
      content: `❌ Impossibile inviare il messaggio a ${utente.tag}. Potrebbero avere i DM disattivati.`,
      ephemeral: true
    });
  }
}
});

// ================================
// 🎧 COMANDO /tempvoice
// ================================

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

if (commandName === 'tempvoice') {
  const user = interaction.user;
  const guild = interaction.guild;
  try {
    const botMember = guild.members.me;
    if (!botMember.permissions.has('ManageChannels')) {
      return interaction.reply({
        content: '❌ Il bot non ha il permesso di creare canali vocali.',
        ephemeral: true
      });
    }

    const name = options.getString('nome');
    const maxUsers = options.getInteger('persone');
    const usersText = options.getString('utenti'); // 👈 TESTO CON MENZIONI

    // Estrai gli ID dagli mention
    const userIds = new Set();
    userIds.add(user.id); // Proprietario sempre incluso
    if (usersText) {
      const mentionRegex = /<@!?(\d+)>/g;
      let match;
      while ((match = mentionRegex.exec(usersText)) !== null) {
        userIds.add(match[1]);
      }
    }

    // Controlla il limite
    if (userIds.size > maxUsers) {
      return interaction.reply({
        content: `❌ Hai specificato ${userIds.size} utenti, ma il limite è ${maxUsers}.`,
        ephemeral: true
      });
    }

    // Costruisci i permessi
    const permissionOverwrites = [
      { id: guild.roles.everyone, deny: ['ViewChannel'] },
      { id: config.staffRoleId, allow: ['ViewChannel', 'Connect', 'Speak'] }
    ];

    // Aggiungi ogni utente autorizzato
    for (const userId of userIds) {
      permissionOverwrites.push({
        id: userId,
        allow: ['ViewChannel', 'Connect', 'Speak']
      });
    }

// Ottieni la categoria
const category = guild.channels.cache.get(config.tempVoiceCategoryId);

if (!category || category.type !== 4) { // 4 = Category
  return interaction.reply({
    content: '❌ La categoria per le stanze temporanee non esiste o non è valida.',
    ephemeral: true
  });
}

// Crea il canale nella categoria
const voiceChannel = await guild.channels.create({
  name: name,
  type: 2,
  userLimit: maxUsers,
  parent: category, // 👈 ASSEGNA LA CATEGORIA
  permissionOverwrites
});

    // Feedback
    const mentionedUsers = Array.from(userIds)
      .filter(id => id !== user.id)
      .map(id => `<@${id}>`)
      .join(', ') || 'Nessuno';

    const embed = new EmbedBuilder()
      .setTitle('🎤 Stanza Vocale Creata')
      .setDescription(`Hai creato la stanza **${voiceChannel}** con limite di **${maxUsers}** persone.`)
      .addFields(
        { name: 'Proprietario', value: `<@${user.id}>`, inline: true },
        { name: 'Utenti Autorizzati', value: mentionedUsers, inline: true }
      )
      .setColor(0x00ff00)
      .setFooter({ text: `Creato da ${user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    // Log
    const logChannel = guild.channels.cache.get(config.logModerationChannelId);
    if (logChannel?.isTextBased()) {
      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎤 Stanza Vocale Temporanea Creata')
            .addFields(
              { name: 'Proprietario', value: `<@${user.id}>`, inline: true },
              { name: 'Canale', value: `${voiceChannel}`, inline: true },
              { name: 'Limite', value: `${maxUsers}`, inline: true },
              { name: 'Utenti Extra', value: mentionedUsers, inline: true }
            )
            .setTimestamp()
        ]
      });
    }

    // Auto-delete
    const interval = setInterval(() => {
      if (voiceChannel.members.size === 0) {
        clearInterval(interval);
        voiceChannel.delete().catch(() => {});
      }
    }, 30000);

  } catch (error) {
    console.error('Errore in /tempvoice:', error);
    await interaction.reply({
      content: '❌ Impossibile creare la stanza vocale.',
      ephemeral: true
    });
  }
}});

// ================================
// 💬 COMANDO /messaggio
// ================================

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, user } = interaction;

  // ✅ COMANDO /messaggio
  if (commandName === 'messaggio') {
    const channel = interaction.channel;

    // 🔒 Controllo: solo canali di testo
    if (!channel?.isTextBased?.()) {
      return interaction.editReply({
        content: '❌ Questo comando funziona solo in canali di testo.',
        ephemeral: true
      });
    }

    // 🔒 Controllo permessi staff
    const staffRole = guild?.roles?.cache?.get?.(config.staffRoleId);
    if (!staffRole || !interaction.member?.roles?.cache?.has?.(config.staffRoleId)) {
      return interaction.editReply({
        content: '❌ Non hai il permesso di usare questo comando.',
        ephemeral: true
      });
    }

    // 📝 Estrai il testo
    const testo = options.getString('testo');
    if (!testo || testo.trim().length === 0) {
      return interaction.editReply({
        content: '❌ Specifica un messaggio valido da inviare.',
        ephemeral: true
      });
    }

    try {
      // 📤 Invia il messaggio nel canale corrente
      await channel.send(testo);

      // 📋 Crea l'embed di conferma
      const embed = new EmbedBuilder()
        .setTitle('📨 Messaggio Inviato')
        .setDescription(`Il seguente messaggio è stato inviato in ${channel}:`)
        .addFields({
          name: 'Contenuto',
          value: testo.length > 1024
            ? testo.substring(0, 1021) + '...'
            : testo
        })
        .setColor(0x00ff00)
        .setFooter({
          text: `Richiesto da ${user.tag}`,
          iconURL: user.displayAvatarURL()
        })
        .setTimestamp();

      // ✅ Risposta al comando (in privato)
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Errore in /messaggio:', error);

      // 🛑 Gestione errori specifici
      let errorMsg = '❌ Impossibile inviare il messaggio.';
      if (error.code === 50013) {
        errorMsg += '\nIl bot non ha i permessi per inviare messaggi in questo canale.';
      } else if (error.message?.includes('Missing Permissions')) {
        errorMsg += '\nPermessi insufficienti (verifica "Invia Messaggi").';
      }

      await interaction.editReply({
        content: errorMsg,
        ephemeral: true
      });
    }
  }
  //messaggio manuale
  // In interactionCreate.js o nel tuo handler dei comandi slash

  if (commandName === 'messaggiodmb') {
  try {
    // 🚨 Defer immediato per evitare timeout
    await interaction.deferReply({ ephemeral: true });

    // 🔒 Controllo permessi staff
    const staffRole = interaction.guild.roles.cache.get(config.staffRoleId);
    if (!staffRole || !interaction.member.roles.cache.has(config.staffRoleId)) {
      return await interaction.editReply({
        content: '❌ Non hai il permesso di usare questo comando.',
        ephemeral: true
      });
    }

    const utente = interaction.options.getUser('utente');
    if (!utente) {
      return await interaction.editReply({
        content: '❌ Specifica un utente valido.',
        ephemeral: true
      });
    }

    // ✉️ Messaggio di benvenuto personalizzato
    const messaggioBenvenuto = `**🎉 Benvenuto/a!** Grazie per esserti unito a **Sbibbi's Community**!\n\n 📌 **Regole principali:**\n> 1. Rispetta tutti i membri\n> 2. No spam / flood\n> 3. Usa i canali corretti\n\n> **🔗 Leggi le regole complete in <#1396083271032377456>**\n\n**Buon divertimento!** 🌴\n*Grazie per la collabrorazione*\n\n-# Se hai bisogno puoi contattare un nostro membro dello staff tramite un <#1396090747786100746>!`;

    try {
      // Invia DM
      await utente.send(messaggioBenvenuto);

      // Conferma visibile solo a chi ha lanciato il comando
      await interaction.editReply({
        content: `✅ Messaggio inviato con successo a ${utente.tag}!`,
        ephemeral: true
      });

    } catch (dmError) {
      console.error(`Errore invio DM a ${utente.tag}:`, dmError);
      await interaction.editReply({
        content: `❌ Impossibile inviare il messaggio a ${utente.tag}. Potrebbe avere i DM disattivati o bloccato il bot.`,
        ephemeral: true
      });
    }

  } catch (globalError) {
    console.error('Errore generale nel comando /messaggiodmb:', globalError);
    await interaction.editReply({
      content: '❌ Si è verificato un errore imprevisto. Contatta lo staff.',
      ephemeral: true
    });
  }
  client.on('guildMemberAdd', async (member) => {
  // 🔹 1. Log join
  const joinLogChannel = client.channels.cache.get(config.joinLeaveLogChannelId);
  if (joinLogChannel?.isTextBased?.()) {
    const embed = new EmbedBuilder()
      .setTitle('📥 Nuovo Membro')
      .setDescription(`**${member.user.tag}** è entrato nel server!`)
      .setColor(0x00FF00)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Utente', value: `<@${member.id}>`, inline: true },
        { name: 'ID', value: `\`${member.id}\``, inline: true },
        { name: 'Account creato', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Membri totali', value: `${member.guild.memberCount}`, inline: true }
      )
      .setTimestamp();
    await joinLogChannel.send({ embeds: [embed] }).catch(() => {});
  }

  // 🔹 2. Invia DM di benvenuto (se abilitato)
  if (!config.welcomeDmEnabled || member.user.bot) return;
  try {
    const message = config.welcomeDmMessage
      .replace(/{user}/g, member.user.toString())
      .replace(/{server}/g, member.guild.name);
    await member.user.send(message);
    console.log(`✅ DM inviato a ${member.user.tag}`);
  } catch (error) {
    console.warn(`⚠️ Impossibile inviare DM a ${member.user.tag}`);
    // Opzionale: log fallimento DM nel canale di join/leave
    if (joinLogChannel?.isTextBased?.()) {
      await joinLogChannel.send(`⚠️ Impossibile inviare DM a ${member.user} (DM chiusi).`).catch(() => {});
    }
  }
});
};

// 🎲 COMANDO /casualmessage
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'casualmessage') {
    await interaction.deferReply({ ephemeral: false }); // Risposta visibile a tutti

    const messaggiCasuali = [
    "@everyone Ci sei quasi... continua così! 🔥",
    "@everyone Oggi è il giorno perfetto per iniziare qualcosa di nuovo. 🌱",
    "@everyone Anche i supereroi hanno bisogno di una pausa. Riposati un attimo. 🦸‍♂️💤",
    "@everyone Sei più forte di quanto pensi. 💎",
    "@everyone Non è mai troppo tardi per fare la cosa giusta. ⏳✅",
    "@everyone Qualcuno, da qualche parte, sta invidiando la tua determinazione. 😉",
    "@everyone Un passo alla volta... e sì, conta anche stare fermo a pensare. 🧠",
    "@everyone Hai appena sbloccato l’achievement: *Essere presente*! 🏆",
    "@everyone Ricordati: anche il WiFi ha bisogno di riavviarsi ogni tanto. 📶",
    "@everyone La tua presenza rende questo server migliore. Grazie per esserci. 💙",
    "@everyone Non sai quanto sei importante finché non provi a sparire... quindi non farlo! 👻➡️😎",
    "@everyone Fai una cosa oggi che il te di domani ringrazierà. 📅✨",
    "@everyone Sei tipo un meme, ma nella migliore versione possibile. 🫶",
    "@everyone Non serve essere perfetto… basta essere te stesso. E te lo dice un bot! 🤖❤️",
    "@everyone Qualcuno ha detto 'caos controllato'? Ah, sì… sono io. 😈",
    "@everyone Respira. Sorridi. Invia un messaggio inutile. Tutto ok. 😌💬",
    "@everyone Anche il caos ha il suo ordine… più o meno. 🌀",
    "@everyone Sei qui, vivo, connesso… e questo è già un successo! 🎉",
    "@everyone La tua energia è preziosa. Non spenderla con chi non la merita. ⚡",
    "@everyone Ehi… sì, proprio tu! Stai andando bene. 🔥"
    ];

    const messaggio = messaggiCasuali[Math.floor(Math.random() * messaggiCasuali.length)];

    try {
      await interaction.editReply(messaggio);
    } catch (error) {
      console.error('Errore in /casualmessage:', error);
      await interaction.editReply({
        content: '❌ Errore durante l’invio del messaggio. Contatta lo staff.',
        ephemeral: true
      });
    }
  }
});
});

// ================================
// 📩 COMANDO /embed - CREA EMBED PERSONALIZZATO
// ================================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  // 💬 COMANDO /embed
  if (commandName === 'embed') {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.channel;
  if (!channel?.isTextBased?.()) {
    return interaction.editReply({ content: '❌ Funziona solo in canali di testo.', ephemeral: true });
  }

  // 🔒 Solo staff
  const staffRole = interaction.guild.roles.cache.get(config.staffRoleId);
  if (!staffRole || !interaction.member.roles.cache.has(config.staffRoleId)) {
    return interaction.editReply({ content: '❌ Solo lo staff può usare questo comando.', ephemeral: true });
  }

  try {
    const titolo = options.getString('titolo');
    const descrizione = options.getString('descrizione');
    let colore = options.getString('colore') || '#00ff7f'; // Verde predefinito
    const immagine = options.getString('immagine');
    const thumbnail = options.getString('thumbnail');
    const footer = options.getString('footer');

    // 🎨 Conversione colore
    if (colore) {
      colore = colore.toLowerCase();
      const colorMap = {
        rosso: '#ff0000',
        verde: '#00ff00',
        blu: '#0000ff',
        giallo: '#ffff00',
        arancione: '#ffa500',
        viola: '#800080',
        rosa: '#ffc0cb',
        nero: '#000000',
        bianco: '#ffffff'
      };
      colore = colorMap[colore] || (colore.startsWith('#') ? colore : `#${colore}`);
    }

    // ✅ Crea l'embed
    const embed = new EmbedBuilder()
      .setDescription(descrizione)
      .setColor(colore);

    if (titolo) embed.setTitle(titolo);
    if (immagine) embed.setImage(immagine);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (footer) embed.setFooter({ text: footer });

    // 📤 Invia nel canale
    await channel.send({ embeds: [embed] });

    // ✅ Feedback in privato
    await interaction.editReply({
      content: '✅ Embed inviato con successo!',
      ephemeral: true
    });

  } catch (error) {
    console.error('Errore in /embed:', error);
    let msg = '❌ Errore durante la creazione dell’embed.';
    if (error.message?.includes('Invalid Form Body')) {
      msg += '\nControlla che URL e colore siano validi.';
    }
    await interaction.editReply({ content: msg, ephemeral: true });
  }
}
// ================================
// ℹ️ COMANDO /supporto - GUIDA COMANDI
// ================================

if (commandName === 'supporto') {
  await interaction.deferReply({ ephemeral: true });

  // Categorie di comandi (adatta in base ai tuoi comandi)
  const categories = [
    {
      name: 'Ticket',
      emoji: '🎫',
      commands: [
        '`/pannelloticket` — Apri il pannello ticket',
      ]
    },
    {
      name: 'Moderazione',
      emoji: '🛡️',
      commands: [
        '`/banna` — Banna un utente',
        '`/espelli` — Espelle un utente',
        '`/aggiorna_ruolo` — Aggiungi/rimuovi un ruolo',
        '`/clear` — Cancella messaggi',
        '`/clearall` — Cancella tutti i messaggi'
      ]
    },
    {
      name: 'Utility',
      emoji: '💬',
      commands: [
        '`/messaggio` — Invia un messaggio personalizzato',
        '`/embed` — Crea un embed personalizzato'
      ]
    },
    {
      name: 'Altro',
      emoji: '⚙️',
      commands: [
        '`/supporto` — Mostra questa guida',
        '`/tempvoice` — Crea una stanza vocale privata'
      ]
    },
    {
      name: 'Cag*** MA Divertenti',
      emoji: '🎲',
      commands: [
        '`/casualmessage` — Invia un messaggio casuale nel canale'
      ]
    }
  ];

  // Crea l'embed
  const embed = new EmbedBuilder()
    .setTitle('🤖 Guida Comandi di Sbibbi’s Assistance')
    .setDescription('Ecco tutti i comandi disponibili, suddivisi per categoria.')
    .setColor(0x5865F2) // Colore ufficiale di Discord
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Richiesto da ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp();

  // Aggiungi ogni categoria come field
  for (const category of categories) {
    embed.addFields({
      name: `${category.emoji} ${category.name}`,
      value: category.commands.join('\n'),
      inline: false
    });
  }

  try {
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Errore in /supporto:', error);
    await interaction.editReply({
      content: '❌ Impossibile mostrare la guida. Riprova più tardi.',
      ephemeral: true
    });
  }
}});
// ================================
// 🎯 IMPOSTA LA PRESENZA DOPO IL PRIMO COMANDO
// ================================

let presenceSet = false;
const statuses = [
  { name: '/supporto', type: 'PLAYING' },
  { name: 'youtube', type: 'WATCHING' },
  { name: 'musica chill', type: 'LISTENING' }
];

client.on('interactionCreate', async interaction => {
  if (!presenceSet && interaction.isChatInputCommand()) {
    presenceSet = true;

    let i = 0;
    setInterval(() => {
      client.user.setPresence({
        activities: [statuses[i]],
        status: 'dnd' // Non disturbare (dnd) / online (online) / idle (luna/assente) / invisible (invisibile)
      });
      i = (i + 1) % statuses.length;
    }, 30000); // Ogni 30 secondi

    console.log('✅ Presenza impostata dopo il primo comando.');
  }
});

// ================================
// 📜 LOG JOIN / LEAVE
// ================================
client.on('guildMemberAdd', async (member) => {
  const logChannel = client.channels.cache.get(config.joinLeaveLogChannelId);
  if (!logChannel?.isTextBased?.()) return;

  const embed = new EmbedBuilder()
    .setTitle('📥 Nuovo Membro')
    .setDescription(`**${member.user.tag}** è entrato nel server!`)
    .setColor(0x00FF00)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Utente', value: `<@${member.id}>`, inline: true },
      { name: 'ID', value: `\`${member.id}\``, inline: true },
      { name: 'Account creato', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Membri totali', value: `${member.guild.memberCount}`, inline: true }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});
});

client.on('guildMemberRemove', async (member) => {
  const logChannel = client.channels.cache.get(config.joinLeaveLogChannelId);
  if (!logChannel?.isTextBased?.()) return;

  const embed = new EmbedBuilder()
    .setTitle('📤 Membro Uscito')
    .setDescription(`**${member.user.tag}** ha lasciato il server.`)
    .setColor(0xFF0000)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Utente', value: `<@${member.id}>`, inline: true },
      { name: 'ID', value: `\`${member.id}\``, inline: true },
      { name: 'Entrato', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: 'Membri rimasti', value: `${member.guild.memberCount}`, inline: true }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});
});

// ================================
// 📜 LOG MESSAGGI ELIMINATI / MODIFICATI
// ================================
client.on('messageDelete', async (message) => {
  if (message.author?.bot || !message.guild || !message.content) return;

  const logChannel = client.channels.cache.get(config.messageLogChannelId);
  if (!logChannel?.isTextBased?.()) return;

  const embed = new EmbedBuilder()
    .setTitle('🗑️ Messaggio Eliminato')
    .setColor(0xFF5733)
    .addFields(
      { name: 'Autore', value: `<@${message.author.id}> (${message.author.tag})`, inline: true },
      { name: 'Canale', value: `<#${message.channel.id}>`, inline: true },
      { name: 'Contenuto', value: message.content.length > 1024 ? message.content.slice(0, 1021) + '...' : message.content }
    )
    .setTimestamp()
    .setFooter({ text: `ID: ${message.id}` });

  await logChannel.send({ embeds: [embed] }).catch(() => {});
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.content === newMessage.content || newMessage.author?.bot || !newMessage.guild) return;
  if (!oldMessage.content || !newMessage.content) return;

  const logChannel = client.channels.cache.get(config.messageLogChannelId);
  if (!logChannel?.isTextBased?.()) return;

  const embed = new EmbedBuilder()
    .setTitle('✏️ Messaggio Modificato')
    .setColor(0x3742fa)
    .addFields(
      { name: 'Autore', value: `<@${newMessage.author.id}> (${newMessage.author.tag})`, inline: true },
      { name: 'Canale', value: `<#${newMessage.channel.id}>`, inline: true },
      { name: 'Prima', value: oldMessage.content.length > 512 ? oldMessage.content.slice(0, 509) + '...' : oldMessage.content },
      { name: 'Dopo', value: newMessage.content.length > 512 ? newMessage.content.slice(0, 509) + '...' : newMessage.content }
    )
    .setTimestamp()
    .setFooter({ text: `ID: ${newMessage.id}` });

  await logChannel.send({ embeds: [embed] }).catch(() => {});
});

// ================================
// 👇 REGISTRA IL COMANDO
// ================================

client.once('ready', async () => { // 👈 AGGIUNGI "async" QUI!
  console.log(`✅ Bot avviato come ${client.user.tag}`);

  // Imposta lo stato
  client.user.setPresence({
    activities: [{ 
      name: '/help • supporto 24/7', 
      type: 'PLAYING' 
    }],
    status: 'online'
  });

  console.log('✅ Presenza impostata');

  const commands = [
    {
      name: 'pannelloticket',
      description: 'Invia il pannello di creazione ticket'
    },
{
  name: 'banna',
  description: 'Banna un utente dal server con durata e DM personalizzato',
  options: [
    { type: 6, name: 'utente', description: 'Utente da bannare', required: true },
    {
      type: 3,
      name: 'durata',
      description: 'Durata del ban (scegli o usa "personalizzato")',
      required: true,
      choices: [
        { name: 'Permanente', value: 'permanente' },
        { name: '1 ora', value: '1h' },
        { name: '6 ore', value: '6h' },
        { name: '1 giorno', value: '1d' },
        { name: '3 giorni', value: '3d' },
        { name: '7 giorni', value: '7d' },
        { name: 'Personalizzato (es. 5h, 2d)', value: 'personalizzato' }
      ]
    },
    { type: 3, name: 'motivo', description: 'Motivo del ban (obbligatorio)', required: false }
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
},
{
  name: 'messaggiodmb',
  description: 'Invia manualmente il messaggio di benvenuto in DM a un utente',
  options: [
    {
      type: 6, // USER
      name: 'utente',
      description: 'Utente a cui inviare il messaggio di benvenuto',
      required: true
    }
  ]
},
{
  name: 'casualmessage',
  description: 'Invia un messaggio casuale nel canale corrente'
},
{
  name: 'sban',
  description: 'Sbanna un utente dal server',
  options: [
    {
      type: 6, // USER
      name: 'utente',
      description: 'Utente da sbannare (specifica l’ID se non è nel server)',
      required: true
    },
    {
      type: 3,
      name: 'motivo',
      description: 'Motivo dello sban',
      required: true
    }
  ]
}];

  try {
    await client.application.commands.set(commands);
    console.log('✅ Comandi registrati globalmente.');
  } catch (error) {
    console.error('❌ Errore nella registrazione dei comandi:', error);
  }

  // Imposta la presenza DOPO la registrazione dei comandi
  const statuses = [
    { name: '/supporto', type: 'PLAYING' },
    { name: 'youtube', type: 'WATCHING' },
    { name: 'musica chill', type: 'LISTENING' }
  ];

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[i]],
      status: 'dnd' // Non disturbare (dnd) / online (online) / idle (luna/assente) /  invisible (invisibile)
    });
    i = (i + 1) % statuses.length;
  }, 30000); // Ogni 30 secondi

  console.log('✅ Presenza impostata correttamente.');

  // 🕒 SCHEDULER: Invia messaggi casuali alle 20:00 ogni giorno
const cron = require('node-cron');

// Lista di messaggi casuali (personalizzala come preferisci)
const messaggiCasuali = [
  "@everyone Ci sei quasi... continua così! 🔥",
  "@everyone Oggi è il giorno perfetto per iniziare qualcosa di nuovo. 🌱",
  "@everyone Anche i supereroi hanno bisogno di una pausa. Riposati un attimo. 🦸‍♂️💤",
  "@everyone Sei più forte di quanto pensi. 💎",
  "@everyone Non è mai troppo tardi per fare la cosa giusta. ⏳✅",
  "@everyone Qualcuno, da qualche parte, sta invidiando la tua determinazione. 😉",
  "@everyone Un passo alla volta... e sì, conta anche stare fermo a pensare. 🧠",
  "@everyone Hai appena sbloccato l’achievement: *Essere presente*! 🏆",
  "@everyone Ricordati: anche il WiFi ha bisogno di riavviarsi ogni tanto. 📶",
  "@everyone La tua presenza rende questo server migliore. Grazie per esserci. 💙",
  "@everyone Non sai quanto sei importante finché non provi a sparire... quindi non farlo! 👻➡️😎",
  "@everyone Fai una cosa oggi che il te di domani ringrazierà. 📅✨",
  "@everyone Sei tipo un meme, ma nella migliore versione possibile. 🫶",
  "@everyone Non serve essere perfetto… basta essere te stesso. E te lo dice un bot! 🤖❤️",
  "@everyone Qualcuno ha detto 'caos controllato'? Ah, sì… sono io. 😈",
  "@everyone Respira. Sorridi. Invia un messaggio inutile. Tutto ok. 😌💬",
  "@everyone Anche il caos ha il suo ordine… più o meno. 🌀",
  "@everyone Sei qui, vivo, connesso… e questo è già un successo! 🎉",
  "@everyone La tua energia è preziosa. Non spenderla con chi non la merita. ⚡",
  "@everyone Ehi… sì, proprio tu! Stai andando bene. 🔥"
];

// ID del canale dove inviare il messaggio (sostituisci con il tuo!)
const CANALE_MESSAGGI_CASUALI = '1396084475515113595'; // 👈 MODIFICA QUESTO!

// Pianifica l'invio alle 20:00 ogni giorno (fuso orario italiano)
cron.schedule('0 20 * * *', async () => {
  const channel = client.channels.cache.get(CANALE_MESSAGGI_CASUALI);
  
  if (!channel || channel.type !== 0) { // 0 = TextChannel
    console.error('❌ Canale non trovato o non testuale.');
    return;
  }

  const messaggio = messaggiCasuali[Math.floor(Math.random() * messaggiCasuali.length)];

  try {
    await channel.send(messaggio);
    console.log(`[SCHEDULER] Messaggio inviato in ${channel.name}: "${messaggio}"`);
  } catch (error) {
    console.error('[SCHEDULER] Errore durante l’invio del messaggio:', error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Rome" // Garantisce che sia alle 20:00 italiane
});
});

// Log in the bot (ensure BOT_TOKEN environment variable or config.botToken is set)
client.login(config.botToken).catch(console.error);