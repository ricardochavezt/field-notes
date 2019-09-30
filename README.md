# FIELD NOTES online

Este es un intento de crear mi propio gestor de notas y enlaces. He usado un montón de gestores de notas y enlaces
a lo largo del tiempo, y al final nunca recuerdo donde apunté algo, así que estoy intentando con un sitio propio,
que además me permitiría tener control sobre dónde almaceno los datos.

Está hecho en base al gran proyecto [hyperdom](https://hyperdom.org/#/), cuyas instrucciones vienen debajo:

## Usage

### Development

#### `yarn dev`

Starts the server on `http://localhost:5000`. This is going to:

- watch and recompile frontend assets on browser code changes
- reload browser on frontend assets change
- watch and restart backend on server side code changes
- make backend available for debugging in Chrome (via `chrome://inspect`)

#### `yarn lint`

Lints js code based on `eslint:recommended` with few handy extras.

#### `yarn test`

Runs browser tests headlessly in electron. Add `--interactive` to see the browser.

### Production

The app is ready to be pushed to [heroku](https://www.heroku.com/).

Alternatively, integrate the following into the deploy pipeline:

#### `yarn build`

Compiles browser assets.

#### `yarn start`

Starts express server.

Make sure `NODE_ENV` is set to `production` for both of the above.
