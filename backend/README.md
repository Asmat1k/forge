# Backend

A small Express 5 API, with all application code under `src`:

```text
src/
  app.js              # Express app, shared headers, routers, 404/error handlers
  server.js           # HTTP listener and process lifecycle
  routes/index.js     # URL mappings using express.Router
  controllers/        # Upload request handlers: zipper, decypher, size2json
  tasks/              # Standalone functions returned by /sample and /promise
  utils/multipart.js  # Existing multipart parsing and upload limit
  constants.js        # Author identifier and upload limit
  app.test.js         # HTTP regression checks
```

From the repository root, run `npm run dev:backend` (watch mode), `npm start`, or `npm test`. From this directory, use `npm run dev` or `npm start`. The backend defaults to port 3000; override with `PORT`.

`app.js` exports the Express `app` without opening a port. `server.js` starts listening only when executed directly. Routers are mounted at `/api` and `/` to preserve existing clients. The frontend remains a separate Vite application.

Handlers use Express `res.status`, `res.type`, `res.send`, and `res.json`. Multipart requests still use Busboy with the existing 1 MiB total-body limit; Express's JSON parser does not handle file uploads. Async handler rejections reach the final four-argument error middleware through Express 5. That middleware delegates to Express when headers have already been sent.

This layout is a project choice, not a required Express architecture. No views, static frontend files, database layer, or service wrappers are needed for this API.

Official references:

- [Modular routing with express.Router](https://expressjs.com/en/guide/routing.html#express-router)
- [Express response methods](https://expressjs.com/en/5x/api.html#res)
- [Error handling](https://expressjs.com/en/guide/error-handling.html)
- [Generator and optional application structure](https://expressjs.com/en/starter/generator.html)
