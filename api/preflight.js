'use strict'

module.exports = function preflight(req, res, next) {
  res.set({
    // This tells the browser we will accept requests
    // from all origins. e.g. any domain
    'Access-Control-Allow-Origin': '*',

    // http methods we will allow
    'Access-Control-Allow-Method': 'POST, GET, OPTIONS',

    // Here we simply say we will accept what ever request
    // headers the client asked for.
    'Access-Control-Allow-Headers': req.headers['access-control-request-headers']
  })
  next()
}
