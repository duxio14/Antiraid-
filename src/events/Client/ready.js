

module.exports = {
    name: 'ready',
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async execute(client) {
        await client.application.commands.set(client.slashCommands.map((cmd) => cmd));
        console.log(`${client.user.username} est bien en ligne.`)
        client.user.setPresence({ activities: [{ name: 'Discord.js v14' }] });
    }
}