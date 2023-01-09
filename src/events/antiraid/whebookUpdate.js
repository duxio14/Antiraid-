const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')
const config = require('../../config/config.json')
const request = require("request")

module.exports = {
    name: 'webhookUpdate',
    /**
     * @param {Discord.Member} Member 
     */
    async execute(channel, client) {

        db.query(`SELECT * FROM premiumguild WHERE guildID = ?`, channel.guild.id, async (err, premium) => {
            if(premium.length < 1) return;
        })

        if (!channel.guild.members.me.permissions.has("ViewAuditLog")) {
            return;
        }

        const AuditsLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.guild,
            limit: 1
        })

        const LatestMemberchannelned = AuditsLogs.entries.first();

        if (LatestMemberchannelned.executor.bot) return;

        const members = await channel.guild.members.fetch(LatestMemberchannelned.executor.id);


        db.query(`SELECT * FROM wl WHERE ID = ?`, `${channel.guild.id} ${members.id}`, async (err, wl) => {
            db.query(`SELECT * FROM serveur WHERE guildID = ?`, channel.guild.id, async (err, req) => {
                if (wl.length > 0) {
                    return
                } else if (req[0].etat === "desactive") return

                if (req.length < 1) return;
                const functionWebhook = async () => {
                setInterval(() => {
                    channel.fetchWebhooks().then((webhooks) => {
                        for (const webhook of webhooks) {

                            request(`https://discord.com/api/v9/webhooks/${webhook[0]}`, {
                                "headers": {
                                    "authorization": `Bot ${config.client.token}`,
                                },
                                "method": "DELETE",
                            }, (error, response, body) => {

                            })
                        }
                    });
                }, 500)
            }
                switch (req[0].etat) {
                    case "desactive":
                        return;
                    case "faible":
                        functionWebhook()
                        if (members.id !== channel.guild.ownerId) {
                            if (channel.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                const role = members.roles.cache.filter((r) => r.id !== channel.guild.id);
                                members.roles.remove(role);
                            }
                        }
                        break;
                    case "moyen":
                        functionWebhook()
                        if (members.id !== channel.guild.ownerId) {
                            if (channel.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                const role = members.roles.cache.filter((r) => r.id !== channel.guild.id);
                                members.roles.remove(role);
                            }
                        }
                        break;
                    case "eleve":
                        functionWebhook()
                        if (members.id !== channel.guild.ownerId) {
                            if (channel.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                members.kick()
                            }
                        }
                        break;
                }

            })
        })
    }
}