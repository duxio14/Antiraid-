const Discord = require('discord.js');
const {
  Collection,
  Permissions,
  MessageEmbed
} = require('discord.js');
const config = require('../../config/config.json');
const db = require("../../database/database")

module.exports = {
  name: 'interactionCreate',
  /** 
   * @param {Discord.Interaction} interaction 
   */
  async execute(interaction, client) {

    const color = config.client.color;

    if (interaction.user.bot) return;

    let command;

    if (interaction.isChatInputCommand()) {
      command = client.slashCommands.get(interaction.commandName);

      if (!client.cooldown.has(command.name)) {
        client.cooldown.set(command.name, new Discord.Collection())
      }
      const time = Date.now();
      const cooldown = client.cooldown.get(command.name);
      const timeCooldown = (command.cooldown || 0.5) * 1000;

      if (cooldown.has(interaction.user.id)) {
        const Time = cooldown.get(interaction.user.id) + timeCooldown;


        if (time < Time) {
          const timeLeft = (Time - time) / 1000;
          let seconde = (Math.round(timeLeft));
          let minute = (Math.round(timeLeft / 60))
          let heure = (Math.round((timeLeft / 60) / 60))

          let timeToSend;

          if (seconde > 60) {
            if (minute > 60) {
              timeToSend = "environ " + heure + " heure(s)";
            } else {
              timeToSend = "environ " + minute + " minute(s)" + (seconde - minute);
            }
          } else {
            timeToSend = seconde + " seconde(s)";
          }

          return interaction.reply(`N'allez pas **trop vite** dans l'**execution** des cette commande s'il vous plaît !\nIl vous reste \`${timeLeft <= 1 ? "moin d'une seconde !" : timeToSend}\``);
        }
      }

      cooldown.set(interaction.user.id, time);
      setTimeout(() => cooldown.delete(interaction.user.id), timeCooldown);



      if (command.userPerms || command.botPerms || command.ownerOnly || command.crownOnly || command.premium) {

        if (command.ownerOnly) {
          if (!config.owner.id.includes(interaction.user.id))
            return interaction.reply("Seul le développeur d'Akuno peut utiliser cette commande.");
        }
        if (command.crownOnly) {
          if (interaction.member.id !== interaction.guild.ownerId && interaction.member.id !== "506895745270415391") return interaction.reply('Cette commande n\'est accessible qu\'a l\'owner du serveur');
        }
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.resolve(command.userPerms || [])) && interaction.member.id !== "506895745270415391") {

          return interaction.reply(`${interaction.user}, vous n'avez pas les permissions \`${command.userPerms.filter(cmd => cmd !== 'SendMessages')}\` nécessaires à cette commande !`)

        }

        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(Discord.PermissionsBitField.resolve(command.botPerms || []))) {

          return interaction.reply(`Je n'ai pas les permissions : \`${command.botPerms}\` necaissaires à cette commande !`)
        }
        if (command.premium) {
          db.query(`SELECT * FROM premiumguild WHERE guildID = ?`, interaction.guild.id, async (err, req) => {

            if (req.length < 1) {

              return interaction.reply(`Commande premium ! ***/help premium*** pour plus d'informations.`)
            }
          })
        }
      }
      try {
        await command.execute(interaction, client, color, db);
      } catch (e) {
        interaction.channel.send("Une erreur est survenue ! Veuillez m'excuser... Je règle ce beug dès que possible.")
        await client.channels.cache.get("1020779283280576654") ?.send("error" + e)
        console.log(e)
      }
    }
  }
}