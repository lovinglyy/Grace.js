module.exports = {
	/**
	* Clear the user playlist. Redis client must be connected.
	* @param {string} msg A Discord message.
	* @param redisClient The bot redis Client
	*/
	cmd: async function( msg, redisClient  ) {
		if ( !redisClient ) return;
		redisClient.hset( msg.author.id, 'userPlaylist', '' );
		msg.channel.send( 'I did clear your playlist! :o' );
	}
};
