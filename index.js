const Discord = require( 'discord.js' );
const components = require( './components/' );
const config = require( './config' );

class Grace {
	constructor( options ) {
		this.config = options.botConfig;
		this.client = options.client;
		this.setup();
	}
	setup() {
		this.client.login ( config.token );
		components.events.init( this );
	}
	getClient() {
		return this.client;
	}
	getConfig() {
		return this.config;
	}
}

new Grace({
	botConfig: config,
	client: new Discord.Client()
});