module.exports = {
	cmd: function( msg, argSeparator ) {
		if ( msg.guild.me.hasPermission( 'KICK_MEMBERS' ) === false ) return msg.reply( 'I need the kick members permission for that command.' );
		const singleArgument = msg.content.substring( argSeparator );
		const mentionedUser = msg.mentions.members.first();
		
		if ( !mentionedUser ) return msg.reply( 'you need to mention the user that will be kicked.' );
		if ( mentionedUser.kickable === false ) return msg.reply( 'I can\'t kick that user! o-o' );
		
		let kickReason = 'Unspecified reason.';
		if (singleArgument.indexOf(" ") !== -1) kickReason = singleArgument.substring(singleArgument.indexOf(" ")+1);

		return mentionedUser.kick({ reason: kickReason })
			.then( () => msg.channel.send( `${msg.author} kicked ${mentionedUser} from the server! \n**Reason:** *${banReason}*.` ) )
			.catch( console.error );
    }
};