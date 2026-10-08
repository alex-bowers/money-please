![Mona Lisa Saperstein from the TV show Parks and Recreation asking her dad for money, using the line "money please".](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDZhMmE2NXEzNmF5c3pnbXlvcjNhd2tobDllYzZyNGN0c2g1aTdwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qVOGUmHt5z7aw/giphy.gif)

I don't like spreadsheets but I need to track my essential spending.

I'm using Cloudflare workers to tracks both my monthly and annual payments. This is set by some default content in `monthly-costs.json`.

I want to ensure that I can afford the large annual payments, whenever they arrive.

[![Image from Gyazo](https://i.gyazo.com/4fe6a7bbfa6c2c00d024ee8529618865.png)](https://gyazo.com/4fe6a7bbfa6c2c00d024ee8529618865)

## Installing on Android

Money Please is a Progressive Web App (PWA). It must be served over HTTPS (or from `localhost`) to be installable.

1. Open the site in Chrome on Android.
2. Open the Chrome menu and choose **Add to Home screen**, then **Install**.

The app shell is cached by `sw.js`, so it opens offline. Costs always come from the Cloudflare worker and are never cached. When you change the list of cached files in `sw.js`, bump `CACHE_NAME`.

### Regenerating the icons

The icons in `icons/` are made from a single source image using the built-in macOS `sips` tool. Replace the crop offset and source file name as needed:

```bash
sips -c 574 574 --cropOffset 0 290 mona-lisa.jpg -s format png --out "$TMPDIR/square.png"
sips -z 512 512 "$TMPDIR/square.png" --out icons/icon-512.png
sips -z 192 192 "$TMPDIR/square.png" --out icons/icon-192.png
sips -z 384 384 "$TMPDIR/square.png" --out "$TMPDIR/maskable-inner.png"
sips -p 512 512 --padColor 3B2D2B "$TMPDIR/maskable-inner.png" --out icons/icon-maskable-512.png
```
