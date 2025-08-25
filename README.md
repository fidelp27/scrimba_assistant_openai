# ReelRecs

## Type

Demo web application

## Project Description

A simple chat-based movie recommendation demo using the [OpenAI Assistants API](https://platform.openai.com/docs/assistants) and [Bun](https://bun.sh).

## Features

- Minimal front-end in `index.html` with a chat form.
- Bun server (`server.js`) that proxies requests to the OpenAI API.
- Utility helpers for creating messages and runs (`utils.js`).
- Example movie data in `movies.txt`.

## Prerequisites

- Bun v1.2.13 or later
- An OpenAI API key stored in a `.env` file as `OPENAI_API_KEY`

## Setup

Install dependencies:

```bash
bun install
```

## Development

Start the development server with hot reloading:

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Build

Build the project:

```bash
bun run build
```

## License

MIT

