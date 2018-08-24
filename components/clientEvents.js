const commands = require("./commands/findCommand");

module.exports = {
	init: function( grace ) {
		const client = grace.getClient();
		const config = grace.getConfig();
		
		client.on('ready', () => {
			console.log(`Grace logged in as ${client.user.tag} at ${client.readyTimestamp} timestamp.`);		
		});
		
		client.on('message', msg => {
			if ( msg.content.indexOf( config.defaultPrefix ) === -1 ) return;
			if ( msg.author.bot === true ) return;		
			const commandAndArgs = msg.content.substring( config.defaultPrefix.length ).toUpperCase();		
			commands.findCommand( msg, commandAndArgs, grace, config.defaultPrefix.length + 1 );
		});
		
        return;
    }
}