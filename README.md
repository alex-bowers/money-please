# Money Please

![Mona Lisa Saperstein from the TV show Parks and Recreation asking her dad for money, using the line "money please".](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDZhMmE2NXEzNmF5c3pnbXlvcjNhd2tobDllYzZyNGN0c2g1aTdwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qVOGUmHt5z7aw/giphy.gif)

I don't like spreadsheets but I need to track my essential spending.

I'm using Cloudflare workers to tracks both my monthly and annual payments. This is set by some default content in `monthly-costs.json`.

I want to ensure that I can afford the large annual payments, whenever they arrive.

## Installing App

Money Please is a Progressive Web App (PWA).

1. Open the site in Chrome.
2. Open the Chrome menu and choose **Add to Home screen**, then **Install**.

The app shell is cached by `sw.js`, so it opens offline. Costs always come from the Cloudflare worker and are never cached. When you change the list of cached files in `sw.js`, bump `CACHE_NAME`.
