const {promisify} = require('util');

module.exports = {
	/**
	* Show a user playlist Redis client must be connected.
	* This function only make use of the Youtube API to search videos.
	* @param {string} msg - A Discord message.
	* @param redisClient A connected and ready to use Redis client.
	*/
	cmd: async function( msg, redisClient  ) {
		if ( !redisClient ) return;

		const hgetAsync = promisify( redisClient.hget ).bind( redisClient );
		let userPlaylist = await hgetAsync( msg.author.id, 'userPlaylist' );
		if (!userPlaylist) return msg.reply( 'you don\'t have a playlist!' );

		let formatedSongs = '';
		if ( userPlaylist.length !== 0 ) {
			let userSongs = userPlaylist.split( '!SongID' );
			for ( let i = 0 ; i < userSongs.length - 1 ; i++ ) {
				if (!userSongs[i]) continue;
				let songTitle = userSongs[i].substring( 0, userSongs[i].indexOf( '!SongTitle' ) );
				if ( songTitle ) formatedSongs += `[**${i+1}**] ${songTitle}\n`;
			}
		}

		if (!formatedSongs) return msg.reply( 'your playlist is empty :o' );
		const embed = { "title": `${msg.member.displayName}'s playlist:`, "color": 11529967,
		"description": formatedSongs.substring(0,1500)
	}
	msg.channel.send( 'Your playlist!', {embed: embed} );
	}
};
