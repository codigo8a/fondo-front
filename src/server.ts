import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// The Express server
const app = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Serve static files from /browser
app.use(express.static(browserDistFolder, {
  maxAge: '1y'
}));

// Serve index.html for all routes (SPA mode)
app.get('*', (req, res) => {
  res.sendFile(join(browserDistFolder, 'index.html'));
});

export { app };
