const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')
const ms = require('ms');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Discord.Member} member
     */
    async execute(member, client) {

        const AuditsLogs = await member.guild.fetchAuditLogs({
            type: AuditLogEvent.BotAdd,
            limit: 1
        })
        const LatestMembermemberned = AuditsLogs.entries.first();

        const members = await member.guild.members.fetch(LatestMembermemberned.executor.id);

        if (member.user.bot) {
            db.query(`SELECT * FROM wl WHERE ID = ?`, `${member.guild.id} ${members.id}`, async (err, wl) => {

                db.query(`SELECT * FROM serveur WHERE guildID = ?`, member.guild.id, async (err, req) => {
                    if (wl.length > 0) {
                        if(req[0].etat === "faible" || req[0].etat === "moyen") return
                    }

                    if (req.length < 1) return
                    switch (req[0].etat) {
                        case "desactive":
                            return;
                            break;
                        case "faible":
                            if (members.id !== member.guild.ownerId) {
                                if (member.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                    return;
                                } else {
                                    const role = members.roles.cache.filter((r) => r.id !== member.guild.id);
                                    members.roles.remove(role);
                                }
                            }
                            await member.ban();
                            break;
                        case "moyen":
                            if (members.id !== member.guild.ownerId) {
                                if (member.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                    return;
                                } else {
                                    const role = members.roles.cache.filter((r) => r.id !== member.guild.id);
                                    members.roles.remove(role);
                                }
                            }
                            await member.ban();
                            break;
                        case "eleve": 
                        if (members.id !== member.guild.ownerId) {
                            if (member.guild.members.me.roles.highest.position <= members.roles.highest.position) {
                                return;
                            } else {
                                members.kick()
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