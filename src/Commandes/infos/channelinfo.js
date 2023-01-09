const Discord = require('discord.js');

module.exports = {

    name: "channelinfo",
    description: "Envoie les informations d'un salon.",
    category: "information",
    ownerOnly: false,
    fondateurOnly: false,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [{
        type: Discord.ApplicationCommandOptionType.Channel,
        name: "salon",
        description: "Veuillez selectionner le salon",
        required: false
    }],

    async execute(interaction, client, color) {
        const channel = interaction.options.getChannel("salon") || interaction.channel;

        if (channel.type === Discord.ChannelType.GuildText || channel.type === Discord.ChannelType.GuildNews) {

            const embed = new Discord.EmbedBuilder()
                .setColor(color)
                .setTitle(`Informations du salon textuel: \`${channel.name}\``)
                .addFields([{
                    name: "informations", value: `**Nom :** \`${channel.name}\`\n**Identifiant :** \`${channel.id}\`\n**Description :** \`${channel.topic !== null ? channel.topic : 'Aucune Description'}\`\n**NSFW :** \`${channel.nsfw ? `Oui` : `Non`}\`\n**Catégorie :** ${channel.parent !== null ? channel.parent.name : 'Non Catégorisé'} **position :** \`${channel.position + 1}\`\n**Date de création :** <t:${Date.parse(channel.createdAt) / 1000}:f>`
                }])

            interaction.reply({
                embeds: [embed]
            })
        }else if(channel.type === Discord.ChannelType.GuildCategory){
            const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Informations dela catégorie: \`${channel.name}\``)
            .addFields([{
                name: "informations", value: `**Nom :** \`${channel.name}\`\n**Identifiant :** \`${channel.id}\`\n**Salons :** \`${channel.children.cache.size}\`\n**Position :** \`${channel.position}\`\n**Date de création :** <t:${Date.parse(channel.createdAt) / 1000}:f>`
            }])

        interaction.reply({
            embeds: [embed]
        })
        }else if(channel.type === Discord.ChannelType.GuildVoice){
            const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Informations du salon vocale: \`${channel.name}\``)
            .addFields([{
                name: "informations", value: `**Nom :** \`${channel.name}\`\n**débit :** \`${channel.bitrate / 1000 + 'kbps'}\`\n**Membre(s) connecté(s) :** \`${channel.members.size}\`\n**Limite d'utilisateurs :** \`${channel.userLimit === 0 ? 'Aucune Limite' : channel.userLimit}\`\n**Date de création :** <t:${Date.parse(channel.createdAt) / 1000}:f>`
            }])

        interaction.reply({
            embeds: [embed]
        })
        }
    }
}