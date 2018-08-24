const reactions = require( './reactions/' );
const moderation = require( './moderation/' );
const owner = require( './owner/' );
const utilities = require( './utilities/' );

module.exports = {
	findCommand: function( msg, commandAndArgs, grace, argSeparator ) {		
		const spacePlace = commandAndArgs.indexOf( " " );
		const CMD_SYNTAX = ( spacePlace === -1 ) ? commandAndArgs : commandAndArgs.substring(0, spacePlace);

		// Reaction commands
		if ( CMD_SYNTAX === 'IDC' ) return reactions.idc(msg, argSeparator + CMD_SYNTAX.length);		
		if ( CMD_SYNTAX === 'POKE' ) return reactions.poke(msg, argSeparator + CMD_SYNTAX.length);
		if ( CMD_SYNTAX === 'YUMMY' ) return reactions.yummy(msg);
		if ( CMD_SYNTAX === 'POSITIVE' ) return reactions.positive(msg, argSeparator + CMD_SYNTAX.length);
		if ( CMD_SYNTAX === 'HUG' || CMD_SYNTAX === 'CUDDLE' ) return reactions.hug(msg, argSeparator + CMD_SYNTAX.length);
		if ( CMD_SYNTAX === 'ANGRY' || CMD_SYNTAX === 'RAGE' ) return reactions.angry(msg, argSeparator + CMD_SYNTAX.length);
		if ( CMD_SYNTAX === 'CHARM' || CMD_SYNTAX === 'FLIRT' ) return reactions.charm(msg), argSeparator + CMD_SYNTAX.length;
		if ( CMD_SYNTAX === 'EW' || CMD_SYNTAX === 'EWW' || CMD_SYNTAX === 'EWW' ) return reactions.ew(msg, argSeparator + CMD_SYNTAX.length);
		
		// Utilities		
		if ( CMD_SYNTAX === 'DP' ) return utilities.dp.cmd( msg, argSeparator + CMD_SYNTAX.length );
		
		// Moderation commands		
		if ( msg.member.hasPermission( "MANAGE_MESSAGES" ) )
			if ( CMD_SYNTAX === 'PURGE' ) return moderation.purge.cmd( msg, argSeparator + CMD_SYNTAX.length );
		if ( msg.member.hasPermission( "BAN_MEMBERS" ) )
			if ( CMD_SYNTAX === 'BAN' ) return moderation.ban.cmd(msg, argSeparator + CMD_SYNTAX.length);
		if ( msg.member.hasPermission( "KICK_MEMBERS" ) )
			if ( CMD_SYNTAX === 'KICK' ) return moderation.kick.cmd(msg, argSeparator + CMD_SYNTAX.length);

		// Commands for the bot owner
		if ( msg.author.id === grace.getConfig().botOwner && msg.guild.ownerID === grace.getConfig().botOwner )
			if ( CMD_SYNTAX === 'BOTMESSAGE' || CMD_SYNTAX === 'BOTMSG' ) return owner.botMsg.cmd( msg, argSeparator + CMD_SYNTAX.length );
        return;
    }
}