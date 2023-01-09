const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')
const ms = require('ms');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction, client) {
        db.query(`SELECT * FROM serveur WHERE guildID = ?`, [interaction.guild.id], async (err, req) => {
            db.query(`SELECT * FROM prenium WHERE userID = ?`, interaction.user.id, async (err, prn) => {


                const embed = new Discord.EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle("Quel niveau d'antiraid voulez vous configuer ?")
                    .setDescription("Pour plus d'information sur les niveaux d'antiraid, un menu déroulant est disponible ci-dessous.")

                const retour = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                    .setCustomId("retour")
                    .setLabel("Retour")
                    .setStyle(Discord.ButtonStyle.Success),
                )
                const infoLvl = new Discord.ActionRowBuilder()
                    .addComponents(new Discord.ButtonBuilder()
                        .setCustomId("infoDesactive")
                        .setLabel("Désactiver")
                        .setStyle(Discord.ButtonStyle.Primary),
                    ).addComponents(new Discord.ButtonBuilder()
                        .setCustomId("infoFaible")
                        .setLabel("Faible")
                        .setStyle(Discord.ButtonStyle.Success),
                    ).addComponents(new Discord.ButtonBuilder()
                        .setCustomId("infoMoyen")
                        .setLabel("Moyen")
                        .setStyle(Discord.ButtonStyle.Secondary),
                    ).addComponents(new Discord.ButtonBuilder()
                        .setCustomId("infoEleve")
                        .setLabel("Elevé")
                        .setStyle(Discord.ButtonStyle.Danger),
                    )
                const menu = new Discord.ActionRowBuilder().addComponents(new Discord.SelectMenuBuilder()
                    .setCustomId('select1')
                    .setPlaceholder('Rien de séléctionné')
                    .addOptions({
                        label: 'Faible',
                        description: 'Informations du niveau faible',
                        value: 'faible',
                    }, {
                        label: 'Moyen',
                        description: 'Informations du niveau moyen',
                        value: 'moyen',
                    }, {
                        label: 'Elevé',
                        description: 'Informations du niveau élevé',
                        value: 'eleve',
                    }, ),
                )
                if (interaction.isButton()) {
                    if (!interaction.member.permissions.has("Administrator")) return;
                    if (!interaction.member.permissions.has("Administrator")) return;
                    switch (interaction.customId) {
                        case "retour":
                            await interaction.deferUpdate()
                            await interaction.message.edit({
                                embeds: [embed],
                                components: [infoLvl, menu]
                            })
                            break;
                        case "antiraid":
                            await interaction.deferUpdate()
                            await interaction.message.edit({
                                embeds: [embed],
                                components: [infoLvl, menu]
                            })
                            break
                        case "infoFaible":
                            if (req.length < 1) {
                                db.query(`INSERT INTO serveur (guildID, etat) VALUES (?, ?)`, [interaction.guild.id, "faible"])
                                interaction.reply({
                                    content: "Le mode **faible** est désormais activé",
                                    ephemeral: true
                                })
                            } else if (req[0].etat !== "faible") {
                                db.query(`UPDATE serveur SET etat = ? WHERE guildID = ?`, ["faible", interaction.guild.id])
                                interaction.reply({
                                    content: "Le mode **faible** est désormais activé",
                                    ephemeral: true
                                })
                            } else {
                                interaction.reply({
                                    content: "Le mode **faible** est déjà activé",
                                    ephemeral: true
                                })
                            }
                            break;
                        case "infoMoyen":
                            if (req.length < 1) {
                                db.query(`INSERT INTO serveur (guildID, etat) VALUES (?, ?)`, [interaction.guild.id, "moyen"])
                                interaction.reply({
                                    content: "Le mode **moyen** est désormais activé",
                                    ephemeral: true
                                })
                            } else if (req[0].etat !== "moyen") {
                                db.query(`UPDATE serveur SET etat = ? WHERE guildID = ?`, ["moyen", interaction.guild.id])
                                interaction.reply({
                                    content: "Le mode **moyen** est désormais activé",
                                    ephemeral: true
                                })
                            } else {
                                interaction.reply({
                                    content: "Le mode **moyen** est déjà activé",
                                    ephemeral: true
                                })
                            }
                            break;
                        case "infoEleve":
                            if (req.length < 1) {
                                db.query(`INSERT INTO serveur (guildID, etat) VALUES (?, ?)`, [interaction.guild.id, "eleve"])
                                interaction.reply({
                                    content: "Le mode **élevé** est désormais activé",
                                    ephemeral: true
                                })
                            } else if (req[0].etat !== "eleve") {
                                db.query(`UPDATE serveur SET etat = ? WHERE guildID = ?`, ["eleve", interaction.guild.id])
                                interaction.reply({
                                    content: "Le mode **élevé** est désormais activé",
                                    ephemeral: true
                                })
                            } else {
                                interaction.reply({
                                    content: "Le mode **élevé** est déjà activé",
                                    ephemeral: true
                                })
                            }
                            break;
                        case "infoDesactive":
                            if (req.length < 1 || req[0].etat === "desactive") {
                                interaction.reply({
                                    content: "L'antiraid est **déjà désactivé**",
                                    ephemeral: true
                                })
                            } else {
                                db.query(`UPDATE serveur SET etat = ? WHERE guildID = ?`, ["desactive", interaction.guild.id])
                                interaction.reply({
                                    content: "L'antiraid **est désormais désactivé**",
                                    ephemeral: true
                                })
                            }
                            break;
                        case "infopremium":
                            prn.length < 1 ? interaction.reply({content: "Le mode premium n'est pas activé, pour l'activer, la commande /premium est disponible.", ephemeral: true}) : interaction.reply({content: "Le mode premium est bien activé.", ephemeral: true})
                            break;
                    }
                } else if (interaction.isSelectMenu()) {
                    if (interaction.customId === "select1") {
                        switch (interaction.values[0]) {
                            case "faible":
                                const embedFaible = new Discord.EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle("Information du niveau **faible** d'antiraid")
                                    .setDescription("Voici les informations du **mode faible de l'antiraid**\nLes antiraids de type antiURL, Webhook etc sont seulements disponibles aux v.i.p.")
                                    .addFields([{
                                        name: "Mode Faible (sanction dérank)",
                                        value: `**Antibot :** \`activé\` (désactivé pour les whiltelist)\n**Antilink :** \`désactivé\`\n**AntiBan :** \`désactivé\`\n**AntiPermAdmin :** \`désactivé\``
                                    },
                                    {
                                        name: "premium",
                                        value: `**AntiWhebook :** \`activé\` (désactivé pour les whitelist)\n**Modifications du serveur (URL, nom ...) :** \`désactivé\`\n**AntiChannel/AntiRole :** \`désactivé\``
                                    }])
                                interaction.message.edit({
                                    embeds: [embedFaible],
                                    components: [retour]
                                })
                                break;
                            case "moyen":
                                const embedMoyen = new Discord.EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle("Information du niveau **moyen** d'antiraid")
                                    .setDescription("Voici les informations du **mode moyen de l'antiraid**\nLes antiraids de type antiURL, Webhook etc sont seulements disponibles aux v.i.p.")
                                    .addFields([{
                                            name: "Mode Moyen (sanction dérank)",
                                            value: `**Antibot :** \`activé\` (désactivé pour les whiltelist)\n**Antilink :** \`activé\` (désactivé pour les whitelist) \n**AntiBan :** \`activé\` (désactivé pour les whitelist)\n**AntiPermAdmin :** \`activé\` (désactivé pour les whitelist)`
                                        },
                                        {
                                            name: "premium",
                                            value: `**AntiWhebook :** \`activé\` (désactivé pour les whitelist)\n**Modifications du serveur (URL, nom ...) :** \`activé\` (désactivé pour les whitelist)\n**AntiChannel/AntiRole :** \`Activé\` (désactivé pour les whitelist)`
                                        }
                                    ])
                                interaction.message.edit({
                                    embeds: [embedMoyen],
                                    components: [retour]
                                })
                                break;
                            case "eleve":
                                const embedEleve = new Discord.EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle("Information du niveau **élevé** d'antiraid")
                                    .setDescription("Voici les informations du **mode élevé de l'antiraid**\nLes antiraids de type antiURL, Webhook etc sont seulements disponibles aux v.i.p.")
                                    .addFields([{
                                            name: "Mode Elevé (sanction kick)",
                                            value: `**Antibot :** \`activé\` (activé pour les whitelist)\n**Antilink :** \`activé\`(activé pour les whitelist)\n**AntiBan :** \`activé\`(activé pour les whitelist)\n**AntiPermAdmin :** \`activé\`(activé pour les whitelist)`
                                        },
                                        {
                                            name: "premium",
                                            value: `**AntiWhebook :** \`activé\` (activé pour les whitelist)\n**Modifications du serveur (URL, nom ...) :** \`activé\` (activé pour les whitelist)\n**AntiChannel/AntiRole :** \`Activé\` (activé pour les whitelist)`
                                        }
                                    ])
                                interaction.message.edit({
                                    embeds: [embedEleve],
                                    components: [retour]
                                })
                                break;
                        }
                    }
                } else {
                    return;
                }
            })
        })
    }
}