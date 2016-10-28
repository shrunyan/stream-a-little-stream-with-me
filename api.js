'use strict'

const express = require('express')
const api = express()

// TODO Explain preflight
// * I hit a roadblock here trying to figure out which headers need to
// be preflighted in order to handle a cors request
// * start by looking at the request from your browser and see what headers
// it requesting
api.use('*', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': req.headers['access-control-request-headers']
  })
  next()
})

api.post('/upload', (req, res) => {
  res.send({
    status: 'success'
  })
})

api.listen(3001)
