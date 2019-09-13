const http = require('http')
const express = require('express')
const morgan = require('morgan')
const loadManifest = require('./loadManifest')

function renderIndexHtml () {
  const manifest = loadManifest()
  const styles = Object.values(manifest).filter(url => url.match(/\.css$/))
  const scripts = Object.values(manifest).filter(url => url.match(/\.js$/))

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Personal notes</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" integrity="sha256-UXesixbeLkB/UYxVTzuj/gg3+LMzgwAmg3zD+C4ZASQ=" crossorigin="anonymous">
    ${styles.map(url => `<link rel="stylesheet" href="/dist/${url}" />`).join('\n')}
  </head>
  <body>
    ${scripts.map(url => `<script type="text/javascript" src="/dist/${url}"></script>`).join('\n')}
  </body>
</html>
  `
}

module.exports = function () {
  const app = express()
  app.use(morgan('dev'))

  app.get('/service-worker.js', (req, res) => {
    const manifest = loadManifest()
    res.sendFile(`${process.cwd()}/browser/dist/${manifest['serviceWorker.js']}`)
  })
  app.use('/dist/', express.static(
    `${process.cwd()}/browser/dist/`,
    {maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0}
  ))

  app.get('/*', (req, res) => {
    res.type('html')
    res.send(renderIndexHtml())
  })

  return app
}

if (!module.parent) {
  const port = process.env.PORT || 5000
  const app = module.exports()
  const server = http.createServer(app)

  if (process.env.NODE_ENV !== 'production') {
    const LiveReload = require('./liveReload')
    new LiveReload({server}).listen()
  }

  server.listen(port, () => {
    console.info(`listening on http://localhost:${port}`)
  })
}
