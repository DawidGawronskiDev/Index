# The Index

A Wikipedia search engine built from scratch. It has four pieces: a crawler that saves Wikipedia pages to disk, a scoring system that ranks them against a search, a small API, and a web page to search from.

Built with undici and cheerio for crawling, Express for the API, SQLite for storage, and React with TanStack Router for the client.

## How it works

1. **Crawl** (`server/features/crawler`): starting from one article, a script opens the page, pulls out its headings, paragraphs, and bibliography, and follows its links to open more pages, then follows those pages' links, and so on. It skips pages that aren't real articles, like Talk pages or Category pages. Each article gets saved as a row in a SQLite database (`server/db`).
2. **Index** (`server/features/search`): when the server starts, it reads every saved article from the database and breaks the text into words, lowercased, punctuation removed, common words like "the" and "and" dropped. It builds a lookup that, for any word, lists every article containing it and how many times it shows up there.
3. **Search** (`server/routes`): a search query goes through the same word breakdown. Each article that shares words with the query gets a score. Words that show up in fewer articles overall count for more, so a rare matching word beats a common one repeated many times. The highest-scoring articles come back first.
4. **Read**: the web app fetches those ranked results, and can also load one full article at a time to display it.

## Project layout

```
server/
  features/crawler/    # saves Wikipedia articles to the database
  features/search/      # breaks articles into words and scores search matches
  routes/                # the API (health check, search, articles)
  db/                     # SQLite connection and queries
client/
  src/features/search/   # search page and article view
  src/routes/             # the app's pages
  src/components/         # navbar, footer, shared UI
```

## Running it

Server and client are separate projects with their own `package.json`, not an npm workspace, so install and run each on its own.

### Server

```
cd server
npm install
cp .env.example .env
npx tsx index.ts
```

Runs on the port set in `.env` (`3000` by default).

To (re)build the document corpus:

```
npx tsx features/crawler/index.ts
```

Edit `SEED_URL` and `PAGE_LIMIT` at the top of `features/crawler/index.ts` to crawl a different starting point or a different number of pages.

There's also a CLI for querying the index directly, without starting the server:

```
npx tsx features/search/index.ts "your query here"
```

### Client

```
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` by default and expects the server at the `FRONTEND_URL`/API origin configured in the server's `.env`.

## API

| Method | Path                | Description                                 |
| ------ | ------------------- | ------------------------------------------- |
| GET    | `/api/health`       | Health check                                |
| GET    | `/api/search?q=`    | Search results, ranked best match first     |
| GET    | `/api/articles/:id` | Full article by id, 404 if it doesn't exist |

## Limitations

The search lookup lives in memory only. It gets rebuilt from scratch every time the server starts, reading and re-processing every article stored in `server/search_engine.db`.

## Attribution

Article content is crawled from [Wikipedia](https://www.wikipedia.org) and used under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.
