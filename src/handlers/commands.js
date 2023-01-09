const fs = require('fs');

module.exports = (client) => {

const commandFolders = fs.readdirSync('./src/Commandes');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/Commandes/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../Commandes/${folder}/${file}`);

        client.slashCommands.set(command.name, command);
        }
    }
}