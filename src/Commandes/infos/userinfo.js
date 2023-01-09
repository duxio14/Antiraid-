
const Discord = require('discord.js')


module.exports = {

    name: "userinfo",
	description: "Envoie les information d'un membre.",
    category: "information",
	ownerOnly: false,
	fondateurOnly: false,
	userPerms: ["SendMessages"],
	botPerms: ["SendMessages"],
    options: [
        {
            type: Discord.ApplicationCommandOptionType.User,
            name: "membre",
            description: "Veuillez selectionner le membre.",
            required: false
        }
    ],
        
	async execute(interaction, client, color) {
        const permissions = {
            "ADMINISTRATOR": "Administrateur",
            "MANAGE_GUILD": "Gérer le serveur",
            "MANAGE_ROLES": "Gérer les roles",
            "MANAGE_CHANNELS": "Gérer les salons",
            "KICK_MEMBERS": "Expulser les membres",
            "BAN_MEMBERS": "Bannir les membres",
            "MANAGE_NICKNAMES": "Gérer les pseudos",
            "MANAGE_EMOJIS": "Gérer les émojis",
            "MANAGE_WEBHOOKS": "Gérer les webhooks",
            "MANAGE_MESSAGES": "Gérer les message",
            "MENTION_EVERYONE": "Mentionner Everyone"
        }
        const mention = interaction.options.getMember('membre') || interaction.member;
        const nick = mention.nickname === null ? "Aucun." : mention.nickname;
        const usericon = mention.user.displayAvatarURL()
        const mentionPermissions = mention.permissions.toArray() === null ? "Aucun." : mention.permissions.toArray();
        const finalPermissions = [];
        for (const permission in permissions) {
            if (mentionPermissions.includes(permission)) finalPermissions.push(`${permissions[permission]}`);
            else;
        }
        let totalWarns;
        var flags = {
            "": "None",
            "CertifiedModerator": "<a:DiscordPartner:970284192778825799>",
            "Staff": "<:employee:975838007410188289>",
            "BugHunterLevel1": "<:BugHunter:976440375982059530>",
            "BugHunterLevel2": "<:DiscordBadgeHunterGold:975837750127386644>",
            "Hypesquad": "<:1936hypersquad:976440729180201000>",
            "HypeSquadOnlineHouse2": "<:badgehypersquad8:975839095840473108>",
            "HypeSquadOnlineHouse1": "<:7725_hypesquad_bravery:976444311090647070>",
            "HypeSquadOnlineHouse3": "<:9792_hypesquad_balance:976444638728683610>",
            "PremiumEarlySupporter": "<:1252_earlysupporter:976444934292918343>",
            "VerifiedBot": "<:8877verifiedblurplesimplified:976455130348146728>",
            "VerifiedDeveloper": "<a:5591discorddeveloperbadgeshimmer:975837750550999090>"
        };
        var bot = {
            "true": "est",
            "false": "n'est pas"
        };
        let status = mention ? mention.presence ? mention.presence.status : "Hors-ligne" : "Inconnu"
        if(status == 'dnd'){
            status = '<:dnd:976462549455347752>'
        }
        if(status == 'online'){
            status = '<:online:976462549358878730>'
        }
        if(status == 'idle'){
            status = '<a:3644moonstars2:976462549384069190>'
        }
        if(status == 'offline'){
            status = '<:4624discordoffline:976462549274988594>'
        }

        let satts;
        if(!mention.user.bot){
            satts = mention.presence?.activities[0]?.state
            if(!satts){
                satts = 'Aucun statut personnalisé'
            }
        }

    const test = mention.presence?.clientStatus;
    let pc

    if(test){
    pc = Object.keys(test).join(", ") ?? "None"
    }else{
        pc = "none"
    }
    
    const plateforme = {
        "desktop": 'Ordinateur',
        "mobile": "Téléphone",
        "web": "Web",
        "mobile, desktop": "Ordinateur et téléphone",
        "none": "Hors-ligne"
    }

    let roles = `<@&${mention._roles.join(">  <@&")}>`;
    if(mention._roles.length < 1){
        roles = "Aucuns roles";
    }
        
        db.query(`SELECT * FROM warns WHERE userID = ${mention.id}`, async (err, req) => {
            totalWarns = req.length
            if (totalWarns < 1) totalWarns = "0, Bien joué ! Vous êtes blanc comme neige (づ｡◕‿‿◕｡)づ"
    
            const userlol = new Discord.EmbedBuilder()
                .setAuthor({ name: `Informations de ${mention.user.username}`, iconURL: mention.user.displayAvatarURL() })
                .setThumbnail(usericon)
                .setColor(color)
                .addFields([
                    { name: '<:Discord_shop:970284195953930251> Informations générales', value: `**Nom :** \`${mention.user.username}\` \n**Tag :** \`${mention.user.discriminator}\` \n**Pseudo :** \`${nick}\`\n**Id :** \`${mention.id}\`\n**Status :** ${status}\n**Status personnalisé :** \`${satts}\`\n**Plateforme :** \`${plateforme[pc]}\``, inline:false },
                    { name: '<:employee:975838007410188289> Profil', value:  `**Badges :** ${mention.user.flags.toArray().map(flag => flags[flag]).join(", ") ?? "None"}\n**Cette utilisateur \`${bot[mention.user.bot]}\` un bot**`, inline: false },
                    { name: '<:annonce:970284195010215966> Informations du serveur', value: `**Role(s) :** ${roles}\n**Warn(s) : **\`${totalWarns}\``, inline: false },
                    { name: '<:Discord_settings:970284202249564201> Informations du compte', value: `**Compte crée le :** \n<t:${Math.round(mention.user.createdAt/1000)}:D> il y a \`${Math.ceil((Date.now() - new Date(mention.user.createdAt)) / (1000 * 60 * 60 * 24))}\` jour(s)\n**Il a rejoint le serveur le :** \n <t:${Math.round(mention.joinedAt/1000)}:D> il y a \`${Math.ceil((Date.now() - new Date(mention.joinedAt)) / (1000 * 60 * 60 * 24))}\` jour(s)`, inline: false },
                ]);
        
        interaction.reply({ embeds: [userlol] })
    })
    }
}

