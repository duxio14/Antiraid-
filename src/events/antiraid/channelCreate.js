const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')


module.exports = {
    name: 'channelCreate',
    /**
     * @param {Discord.Channel} channel
     */
    async execute(channel, client) {

        db.query(`SELECT * FROM premiumguild WHERE guildID = ?`, channel.guild.id, async (err, premium) => {
            if(premium.length < 1) return;
        })

        if (!channel.guild.members.me.permissions.has("ViewAuditLog")) {
            return;
        }

        const AuditsLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1
        })

        const LatestMemberBanned = AuditsLogs.entries.first();
     
        const memberr = await channel.guild.members.fetch(LatestMemberBanned.executor.id);

        db.query(`SELECT * FROM wl WHERE ID = ?`, `${channel.guild.id} ${memberr.id}`, async (err, wl) => {
            db.query(`SELECT * FROM serveur WHERE guildID = ?`, channel.guild.id, async (err, req) => {
                if (wl.length > 0) {
                    return
                } else if (req[0].etat !== "moyen" && req[0].etat !== "eleve") return
             
                if (req.length < 1) return;

                switch (req[0].etat) {
                    case "moyen":
                     
                        channel.delete()
                        if (memberr.id === channel.guild.ownerId) return;
                        if (channel.guild.members.me.channels.highest.position <= memberr.channels.highest.position) {
                            return;
                        } else {
                            const channels = memberr.channels.cache.filter((r) => r.id !== channel.guild.id);
                            memberr.channels.remove(channels);
                        }

                        break;
                    case "eleve":
                        channel.delete()
                        if (memberr.id === channel.ownerId) return;
                        if (channel.guild.members.me.channels.highest.position <= memberr.channels.highest.position) {
                            return;
                        } else {
                           memberr.kick()
                        }
                        break;
                }

            })
        })
    }
}