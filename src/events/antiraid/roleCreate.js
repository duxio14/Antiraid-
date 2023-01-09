const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')


module.exports = {
    name: 'roleCreate',
    /**
     * @param {Discord.Role} role
     */
    async execute(role, client) {

        db.query(`SELECT * FROM premiumguild WHERE guildID = ?`, role.guild.id, async (err, premium) => {
            if(premium.length < 1) return;
        })

        if (!role.guild.members.me.permissions.has("ViewAuditLog")) {
            return;
        }

        const AuditsLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
            limit: 1
        })

        const LatestMemberBanned = AuditsLogs.entries.first();
     
        const memberr = await role.guild.members.fetch(LatestMemberBanned.executor.id);

        db.query(`SELECT * FROM wl WHERE ID = ?`, `${role.guild.id} ${memberr.id}`, async (err, wl) => {
            db.query(`SELECT * FROM serveur WHERE guildID = ?`, role.guild.id, async (err, req) => {
                if (wl.length > 0) {
                    return
                } else if (req[0].etat !== "moyen" && req[0].etat !== "eleve") return
             
                if (req.length < 1) return;

                switch (req[0].etat) {
                    case "moyen":
                     
                        role.delete()
                        if (memberr.id === role.guild.ownerId) return;
                        if (role.guild.members.me.roles.highest.position <= memberr.roles.highest.position) {
                            return;
                        } else {
                            const roles = memberr.roles.cache.filter((r) => r.id !== role.guild.id);
                            memberr.roles.remove(roles);
                        }

                        break;
                    case "eleve":
                        role.delete()
                        if (memberr.id === role.ownerId) return;
                        if (role.guild.members.me.roles.highest.position <= memberr.roles.highest.position) {
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