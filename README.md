### Convert mp3 to ogg

`for f in ./*.mp3; do ffmpeg -i "$f" -c:a libvorbis -q:a 4 "${f/%mp3/ogg}"; done`

`ffmpeg -i file.wav -c:a libvobris -b:a 128k file.ogg`

### Asset sources

https://www.flaticon.com/packs/gastronomy-set

https://opengameart.org/content/pleasant-creek

https://elements.envato.com/children-shout-hooray-M3WEYH6

### GH Pages deployment tutorial

https://vitejs.dev/guide/static-deploy.html#github-pages
