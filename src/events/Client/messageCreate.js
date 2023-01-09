const db = require("../../database/database")
const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(message, client) {


        if (message.author.bot) return;

        if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
            const embed = new Discord.EmbedBuilder()
                .setColor("DarkAqua")
                .setTitle('Je suis bien en ligne !')
                .setDescription(`Je vous protège ! \nMon préfix : / (slashCommandes )`)
            message.reply({
                embeds: [embed]
            })
        }
        const antilinkB = [
            ".com",
            "https://",
            "http://",
            "discord.gg/"
        ]

        for (let i = 0; i < antilinkB.length; i++) {
            if (message.content.includes(antilinkB[i])) {
                const member = message.member;
                db.query(`SELECT * FROM wl WHERE ID = ?`, `${member.guild.id} ${member.id}`, async (err, wl) => {
                    db.query(`SELECT * FROM serveur WHERE guildID = ?`, message.guild.id, async (err, req) => {
                        if (wl.length > 0) {
                            return
                        }else if(req[0].etat !== "eleve") return

                        if (req.length < 1) return
                        switch (req[0].etat) {
                            case "desactive":
                                return;
                                break;
                            case "faible":
                                return
                                break;
                            case "moyen":
                                message.delete()
                                if (member.id !== message.guild.ownerId) {
                                    if (message.guild.member.me.roles.highest.position <= member.roles.highest.position) {
                                        return;
                                    } else {
                                        const role = member.roles.cache.filter((r) => r.id !== message.guild.id);
                                        member.roles.remove(role);
                                    }
                                }
                                await member.ban();
                                break;
                            case "eleve":
                                message.delete()
                                if (member.id !== message.guild.ownerId) {
                                    if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
                                        return;
                                    } else {
                                        member.kick()
                                    }
                                }
                                await member.ban();
                                break;
                        }

                    })
                })
            }
        }
    }
}