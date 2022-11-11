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
