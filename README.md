![Grace](https://i.imgur.com/uUoHzjy.png)

Grace is a Discord bot in development, the goal is to be the more complete as possible, keeping a good performance.
What Grace can do for now:
  - Essential features: user reactions, ban/kick command, purge messages, show a user profile picture, play songs with playlist for guilds.
  - Another features: Try to find a specific user by his display name (you can test it with the Discord profile picture command), allow users to have their personal song playlist and add songs to the guild queue from it.

### Commands

* Currency
  * Bank: Show current blossoms.
  * Daily: Get the free daily blossoms
* Games
  * pubgstats <player name>: Shows stats for a player in the current season.
* Moderation
  * Ban <@mention member> optional: <days to ban> "<reason>": Ban a Guild Member by their name mention.
  * Kick <@mention member> optional: <reason>: Kick a Guild Member by their name mention.
  * Purge <amount>: Purge a specific amount of messages(max 50) in the current channel.
* Music
  * Playlist: Show the user personal playlist.
  * Play <song name/youtube link/personal playlist song number>: Play a song in the current voice channel.
  * Playlistadd <song url/song name>: Add a song to the personal playlist, up to 15 songs.
  * Playlistclear: Clear the personal playlist.
  * Playlistremove: Remove a single song from the playlist, by it's song number.
  * Queue optional: <clear>: Show the guild song queue, if the clear parameter is specified, clear songs from the guild queue(need manage messages permission),
* Owner
  * Botmessage: Send a embed like if you was the bot, for info channels etc.
* Utilities
  * Ask: Ask Grace something!
  * Dp <mention, id, username&discriminator or search for a member>: Show the Discord profile picture of a member

![Personal playlists](http://i.imgur.com/wLEFEbK.gif)

Requeriments: Redis (it's more easy to install it on Windows 10 now with it's new feature) and FFmpeg(easy to install it on Windows 10 too, with Chocolatey, [check it here](https://chocolatey.org/packages/ffmpeg)), both can be installed on a Linux system with simple commands! Another requeriments are installed by the npm.

[![Discord](https://i.imgur.com/doyH2tC.png)](https://discord.gg/QtnPqZg)

Click on the image to join the development Discord server, or use [this link](https://discord.gg/QtnPqZg).
