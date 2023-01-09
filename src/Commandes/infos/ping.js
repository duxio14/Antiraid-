
const Discord = require('discord.js')


module.exports = {

	name: "ping",
	description: "Affiche la latence du bot",
	category: "information",
	ownerOnly: false,
	fondateurOnly: false,
	userPerms: ["SendMessages"],
	botPerms: ["SendMessages"],

	async execute(interaction, client, color) {


		await interaction.reply(`Mon ping est de : ${client.ws.ping}`);	
	},
};