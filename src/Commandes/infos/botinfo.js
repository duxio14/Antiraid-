
const Discord = require('discord.js')
const ms = require('ms')


module.exports = {

  name: "botinfo",
  description: "Envoie les informations du bot",
  category: "information",
  ownerOnly: false,
  fondateurOnly: false,
  userPerms: ["SendMessages"],
  botPerms: ["SendMessages"],

  async execute(interaction, client, color) {

    let uptime = [];

    Object.entries(ms(client.uptime)).map((x, y) => {
      if (x[1] > 0 && y < 4) uptime.push(`**${x[1]} ${x[0]}**`);
    });
    const nick = interaction.guild.members.me.nickname === null ? "Aucun." : interaction.guild.members.me.nickname;

    const embed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(`Informations d'\`${client.user.username}\``)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([{
          name: `<:Discord_shop:970284195953930251> Informations du bot :`,
          value: `**Nom :** \`${client.user.username}\`\n**Tag :** \`${client.user.discriminator}\`\n**Id :** \`${client.user.id}\`\n**Pseudo du serveur :** \`${nick}\`\n**Date de création :** \`2 Janvier 2022\`\n**Node.js :** \`${process.version}\`\n**Créateur :** \`Duxio\`\n**En ligne depuis :** \`${ms(client.uptime)}\``,
          inline: false
        },
        {
          name: `<:Discord_settings:970284202249564201> Informations Statistiques :`,
          value: `**Serveur(s) :** \`${client.guilds.cache.size}\`\n**Utilisateur(s) :** \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`\n**Salons :** \`${client.channels.cache.size}\``,
          inline: false
        }
      ])
      

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel('Lien d\'invitation du Bot')
        .setStyle('Link')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=1033420101170507956&permissions=8&scope=bot')
      
      )
    interaction.reply({
      embeds: [embed],
      components: [row]
    });

  }
}