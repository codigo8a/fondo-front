const express = require('express');
const { APP_BASE_HREF } = require('@angular/common');
const { existsSync } = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd(), 'dist', 'fondo-front');

// Import the SSR app
const { app: ssrApp } = require('./dist/fondo-front/server/server.mjs');

// Serve static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the SSR app
app.get('*', (req, res) => {
  ssrApp(req, res);
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});