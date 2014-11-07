Spotify Web API Player Example
==================

This is a Web Player built using the [Spotify Web API](https://developer.spotify.com/web-api/). For
trying it out, you can navigate to [http://lab.possan.se/thirtify/](http://lab.possan.se/thirtify/)
or clone the project and run it locally.

![Web API Player Example Screenshot](https://raw.githubusercontent.com/possan/webapi-player-example/master/readme-img/webapi-player-example.jpg)

Note that you will need a Spotify account (either free or premium) to log in to the site.

## How to Run
You will need to run a server. The example is ready to work in the port 8000, so you can do:

    $ python -m SimpleHTTPServer 8000

and open `http://localhost:8000` in a browser. (This requires python to be installed on your machine.)

## Features

Most of the functionality offered through the Spotify Web API endpoints is implemented in this player:

- Play 30 second audio previews
- Render track, album and artist information
- Render new releases in Spotify and featured playlists
- Search for tracks
- Fetch user's playlists, rename then and change their visibility
- Delete track from playlist
- Fetch user's saved tracks and save a tracks
- Follow and unfollow artists or users
- Check if the user is following an artist or user