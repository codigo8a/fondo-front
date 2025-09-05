const express = require('express');
const { ngExpressEngine } = require('@nguniversal/express-engine');
const { APP_BASE_HREF } = require('@angular/common');
const { existsSync } = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd(), 'dist');

// The Express server
const bootstrap = require('./dist/fondo-front/server/server.mjs');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: bootstrap.default,
}));

app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'fondo-front/browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'fondo-front/browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});