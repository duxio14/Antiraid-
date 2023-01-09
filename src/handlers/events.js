const fs = require('fs');

module.exports = (client) => {

const eventFolders = fs.readdirSync('./src/events');

for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../events/${folder}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client)).then(() => {
                console.log('events chargés')
            })
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
         }
        }
    }
}