
const Discord = require('discord.js');
const {
  ChannelType
} = require('discord.js');

module.exports = {

  name: "serveurinfo",
  description: "Envoie les informations du serveur.",
  category: "information",
  ownerOnly: false,
  fondateurOnly: false,
  userPerms: ["SendMessages"],
  botPerms: ["SendMessages"],

  async execute(interaction, client, color) {

    const afk =
      interaction.guild.afkChannel === null ? "`Aucun.`" : interaction.guild.afkChannel;
    const servericon = interaction.guild.iconURL();
    const verifLevels = [
      "Aucun.",
      "Bas.",
      "Moyen.",
      "(╯°□°）╯︵  ┻━┻ (Elevé)",
      "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻ (Très élevé)",
    ];

    const serverembed = new Discord.EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL()
      })
      .setThumbnail(servericon)
      .addFields([{
          name: `<:Discord_shop:970284195953930251> Informations générales :`,
          value: `**Identifiant :** \`${interaction.guild.id}\`\n**Owner :** ${interaction.guild.members.cache.get(interaction.guild.ownerId)} \n**level de boost :** \`${verifLevels[interaction.guild.verificationLevel]}\`\n**Serveur crée le** <t:${Math.round(interaction.guild.createdAt/1000)}:D> **il y a** \`${Math.ceil((Date.now() - new Date(interaction.guild.createdAt)) / (1000 * 60 * 60 * 24))}\` jour(s)`,
          inline: false
        },
        {
          name: `<:Discord_rules:970284201565900830> Informations :`,
          value: `**Salons :** \`${interaction.guild.channels.cache.size}\` \n**Salons textuels :** \`${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size}\` \n**Salons vocaux :** \`${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size}\` \n**Salons AFK :** ${afk}\n**Roles :** \`${interaction.guild.roles.cache.size }\` \n**Emojis :** \`${interaction.guild.emojis.cache.size}\``,
          inline: false
        },
        {
          name: `<:blurplemembers:970284198441140234> Informations des membres :`,
          value: `**Membres :** \`${interaction.guild.memberCount}\`\n**En ligne** : \`${(await interaction.guild.members.cache).filter(m => m.presence?.status !== "offline").size}\`\n**Humains :** \`${
              interaction.guild.members.cache.filter((member) => !member.user.bot).size
            }\`\n**Bots :** \`${
              interaction.guild.members.cache.filter((member) => member.user.bot).size
            }\``,
          inline: false
        }
      ])
      .setThumbnail(interaction.guild.iconURL())
      .setColor(color)
      .setTimestamp();

    interaction.reply({
      embeds: [serverembed]
    });
  },
};