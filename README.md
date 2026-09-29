# Velvet Reel — luxury movies website

Plain HTML + CSS + JS (Bootstrap 5 from CDN). No build step, no backend.
Open `index.html` (or deploy the folder as-is on Vercel / Netlify / GitHub Pages).

## Pages
| Page | What it does |
|---|---|
| `index.html` | Curtain intro, cinematic hero slider, genres, trending, mood picks, top rated |
| `movies.html` | Search + genre chips + language / era / sort filters |
| `movie.html?id=…` | Movie details, cast, trailer, watchlist, tickets |
| `booking.html?id=…` | Date + showtime + live seat map (Silver / Gold / Platinum) |
| `tickets.html` | Your booked tickets with barcode stub, cancel option |
| `watchlist.html` | Saved movies |
| `login.html` / `signup.html` | Demo accounts (stored in the browser) |
| `about.html` / `contact.html` | Info + contact form |

Press `/` (or Ctrl+K) on any page for instant search.

## Change things
* **Brand / contact / ticket prices** → `js/config.js`
* **Add or edit movies** → `js/data.js` (copy any object; `w` = exact Wikipedia article title so the real poster loads automatically)
* **Colours** → CSS variables at the top of `css/style.css`

## Posters & trailers
* Default (no key): real posters load from Wikipedia; if a poster can't load, a built-in cinematic poster is shown, so the site never looks broken.
* Optional: put a free TMDB API key in `js/config.js` (`TMDB_KEY`) for HD posters, backdrops and trailers that play inside the site.

## Note
Accounts, watchlist and tickets are saved in the browser's localStorage. This is a front-end demo: no real payments and no real security. Connect a backend before using it for real customers.
