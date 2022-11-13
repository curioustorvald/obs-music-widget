This is a web page that plays a music when loaded.

Simply host this web page on your local machine, write a playlist, then add a browser source with link `localhost/obs-music-widget (or a name of your choice)/index.html?p=my_playlist.json` on the OBS.

The playlist format must be as follows:

```
[
{"f":"song_01.opus", "t":"Song Title", "a":"Artist Name"},
{"f":"song_02.mp3", "t":"Song Title", "a":"Artist Name"},
...
]
```

After writing the playlist, create a folder named `audio` on the location where the `index.html` is on, then load up the music files to the subdirectory.

The player widget will look like this:

![Widget](readme_img01.png)


## Customising the Playlist Using the Meta Properties

Meta information of the playlist can be specified by adding the `meta` object on the first index of the array, such as:

```
[
{"meta":1, "random":1}
{"f":"song_01.opus", "t":"Song Title", "a":"Artist Name"},
{"f":"song_02.mp3", "t":"Song Title", "a":"Artist Name"},
...
]
```

The available options are:

- **random** — if the songs on the playlist must be played randomly


## Global Override of the Playback

By specifying the following options to the URL, you can control the player's behaviour. The options can be specified as `localhost/music/?p=my_playlist.json&c=123&r=1`

Available options are:

- **c**=000 — start the playback from the specified index (the counting starts from 1)
- **r**=1 — enables the shuffle mode. Specifying `r=0` will NOT turn random-playlist to not random
