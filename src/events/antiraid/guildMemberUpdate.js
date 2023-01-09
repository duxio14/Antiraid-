const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')

module.exports = {
    name: 'guildMemberUpdate',
    /**
     * @param {Discord.Member} Member 
     */
    async execute(oldMember, newMember, client) {

        if (!oldMember.guild.members.me.permissions.has("ViewAuditLog")) {
            return;
        }

        const AuditsLogs = await oldMember.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberRoleUpdate,
            limit: 1
        })
        const LatestMembermemberned = AuditsLogs.entries.first();

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {

            const role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();


            if (role.permissions.has("Administrator")) {

                const memberr = await oldMember.guild.members.fetch(LatestMembermemberned.executor.id);

                db.query(`SELECT * FROM serveur WHERE guildID = ?`, oldMember.guild.id, async (err, req) => {

                    db.query(`SELECT * FROM wl WHERE ID = ?`, `${oldMember.guild.id} ${memberr.id}`, async (err, wl) => {
                        if (wl.length > 0) {
                            return
                        } else if (req[0].etat !== "eleve") return

                        switch (req[0].etat) {
                            case "desactive":
                                return;
                                break;
                            case "faible":
                                return;
                                break;
                            case "moyen":
                                if (newMember.id === newMember.guild.ownerId) return;
                                if (newMember.guild.members.me.roles.highest.position <= newMember.roles.highest.position) {
                                    return;
                                } else {
                                    newMember.roles.remove(role);
                                }
                                if (memberr.id === newMember.guild.ownerId) return;
                                if (newMember.guild.members.me.roles.highest.position <= memberr.roles.highest.position) {
                                    return;
                                } else {
                                    const roles = memberr.roles.cache.filter((r) => r.id !== newMember.guild.id);
                                    memberr.roles.remove(roles);
                                }
                                break;
                            case "eleve":
                                if (newMember.id === newMember.guild.ownerId) return;
                                if (newMember.guild.members.me.roles.highest.position <= newMember.roles.highest.position) {
                                    return;
                                } else {
                                    newMember.roles.remove(role);
                                }
                                if (memberr.id === newMember.guild.ownerId) return;
                                if (newMember.guild.members.me.roles.highest.position <= memberr.roles.highest.position) {
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


    }
}