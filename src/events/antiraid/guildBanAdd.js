const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')

module.exports = {
    name: 'guildBanAdd',
    /**
     * @param {Discord.Ban} ban 
     */
    async execute(ban, client) {

        if (!ban.guild.members.me.permissions.has("ViewAuditLog")) {
            return;
        }

        const AuditsLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.guild,
            limit: 1
        })

        const LatestMemberBanned = AuditsLogs.entries.first();

        if (LatestMemberBanned.executor.bot) return;

        const members = await ban.guild.members.fetch(LatestMemberBanned.executor.id);


        db.query(`SELECT * FROM wl WHERE ID = ?`, `${ban.guild.id} ${members.id}`, async (err, wl) => {
            db.query(`SELECT * FROM serveur WHERE guildID = ?`, ban.guild.id, async (err, req) => {
                if (wl.length > 0) {
                    return
                } else if (req[0].etat !== "eleve") return

                if (req.length < 1) return;

                switch (req[0].etat) {
                    case "desactive":
                        return;
                        break;
                    case "faible":
                        return;
                        break;
                    case "moyen":
                        if (members.id !== ban.guild.ownerId) {
                            if (ban.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                const role = members.roles.cache.filter((r) => r.id !== ban.guild.id);
                                members.roles.remove(role);
                            }
                        }
                        await interaction.guild.members.unban(ban.user.id);
                        break;
                    case "eleve":
                        if (members.id !== ban.guild.ownerId) {
                            if (ban.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                members.kick()
                            }
                        }
                        await interaction.guild.members.unban(ban.user.id);
                        break;
                }

            })
        })
    }
}