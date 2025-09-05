const express = require('express');
const { APP_BASE_HREF } = require('@angular/common');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd(), 'dist', 'fondo-front');

// Serve static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// For SSR, import the server app
try {
  const { app: ssrApp } = require('./dist/fondo-front/server/server.mjs');
  app.get('*', ssrApp);
} catch (err) {
  console.log('SSR not available, serving static files only');
  // Fallback to serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_FOLDER, 'browser', 'index.html'));
  });
}

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});