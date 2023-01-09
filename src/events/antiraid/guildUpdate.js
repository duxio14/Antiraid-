const db = require("../../database/database")
const {
    AuditLogEvent
} = require('discord.js')
const Discord = require('discord.js')
const ms = require('ms');
const config = require('../../config/config.json')
const request = require("request")

module.exports = {
    name: 'guildUpdate',
    /**
     * @param {Discord.Member} member
     */
    async execute(oldGuild, newGuild, client) {

        db.query(`SELECT * FROM premiumguild WHERE guildID = ?`, newGuild.id, async (err, premium) => {
            if (premium.length < 1) return;
        })

        const AuditsLogs = await oldGuild.fetchAuditLogs({
            type: AuditLogEvent.GuildUpdate,
            limit: 1
        })

        const LatestMemberUpdate = AuditsLogs.entries.first();

        if (LatestMemberUpdate.executor.bot) return;
        let memberr = await oldGuild.members.fetch(LatestMemberUpdate.executor.id)

        db.query(`SELECT * FROM wl WHERE ID = ?`, `${newGuild.id} ${memberr.id}`, async (err, wl) => {
            db.query(`SELECT * FROM serveur WHERE guildID = ?`, newGuild.id, async (err, req) => {
                if (wl.length > 0) {
                    return
                } else if (req[0].etat === "desactive") return

                if (req.length < 1) return;

                switch (req[0].etat) {
                    case "desactive":
                       
                        break;
                    case "faible":
                        return;
                    case "moyen":
                        update(oldGuild, newGuild)
                        if (memberr.id === newGuild.ownerId) return;
                        if (newGuild.members.me.roles.highest.position <= memberr.roles.highest.position) {
                            return;
                        } else {
                            const roles = memberr.roles.cache.filter((r) => r.id !== newGuild.id);
                            memberr.roles.remove(roles);
                        }

                        break;
                    case "eleve":
                        update(oldGuild, newGuild)
                        if (memberr.id === newGuild.ownerId) return;
                        if (newGuild.members.me.roles.highest.position <= memberr.roles.highest.position) {
                            return;
                        } else {
                           memberr.kick()
                        }
                        break;
                }

            })
        })

        async function update(oldGuild, newGuild) {

            if (oldGuild.name !== newGuild.name) {
                await newGuild.setName(oldGuild.name)
            }
            if (oldGuild.iconURL({
                    dynamic: true
                }) !== newGuild.iconURL({
                    dynamic: true
                })) {
                await newGuild.setIcon(oldGuild.iconURL({
                    dynamic: true
                }))
            }
            if (oldGuild.bannerURL() !== newGuild.bannerURL()) {
                await newGuild.setBanner(oldGuild.bannerURL())
            }
            if (oldGuild.position !== newGuild.position) {
                await newGuild.setChannelPositions([{
                    channel: oldGuild.id,
                    position: oldGuild.position
                }])
            }

            if (oldGuild.systemChannel !== newGuild.systemChannel) {
                await newGuild.setSystemChannel(oldGuild.systemChannel)
            }
            if (oldGuild.systemChannelFlags !== newGuild.systemChannelFlags) {
                await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)
            }
            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                await newGuild.setVerificationLevel(oldGuild.verificationLevel)
            }
            if (oldGuild.widget !== newGuild.widget) {
                await newGuild.setWidget(oldGuild.widget)
            }
            if (oldGuild.splashURL !== newGuild.splashURL) {
                await newGuild.setSplash(oldGuild.splashURL)
            }
            if (oldGuild.rulesChannel !== newGuild.rulesChannel) {
                await newGuild.setRulesChannel(oldGuild.rulesChannel)
            }
            if (oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel) {
                await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)
            }
            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)
            }
            if (oldGuild.afkChannel !== newGuild.afkChannel) {
                await newGuild.setAFKChannel(oldGuild.afkChannel)
            }
            if (oldGuild.region !== newGuild.region) {
                await newGuild.setRegion(oldGuild.region)
            }

            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                await newGuild.setAFKTimeout(oldGuild.afkTimeout)
            }
            if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                const settings = {
                    url: `https://discord.com/api/v6/guilds/${oldGuild.id}/vanity-url`,
                    body: {
                        code: oldGuild.vanityURLCode
                    },
                    json: true,
                    method: 'PATCH',
                    headers: {
                        "Authorization": `Bot ${config.client.token}`
                    }
                };
                request(settings, (err, res, body) => {
                    if (err) {
                        return;
                    }
                })
            }

        }
    }
}