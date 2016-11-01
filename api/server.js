'use strict'

const express = require('express')
const Busboy = require('busboy')
const gm = require('gm')
const preflight = require('./preflight')
const upload = require('./upload')
const api = express()

// express middleware which sets our
// `Access-Control-Allow-*` headers. These
// are what informs the browser of what our
// service will accept.
api.use('*', preflight)

api.post('/upload', (req, res) => {
  const uploads = []
  const form = new Busboy({
    headers: req.headers
  })

  form.on('file', (fieldname, file, filename, encoding, mimetype) => {

    // Our stream processing does not begin untill the
    // on `data` event is called.
    file.on('data', (data) => {

      // As we recieve data from our file stream
      // we are going to pass it through an image
      // processing library to alter the image
      // and get a stream back out.
      const stream = gm(data)
        // .resize(200, 200)
        // .noise('laplacian')
        // .monochrome()
        .stream()

      // I'm cheating here by using a pre-created bucket
      // this would usally be something you pull from a datastore
      // or you request from s3.
      const bucket = process.env.BUCKET

      // access control list(acl) is what specifys the permissions
      // on the file we are uploading to s3
      const acl = 'public-read'
      const promise = upload(bucket, stream, filename, mimetype, acl)

      // keep a list of all our request promises to s3
      // this way we can handle them all at once once the
      // form upload triggers it's `finish` event
      uploads.push(promise)
    })

    // This event is triggered once all the contents of
    // our file stream have been read.
    // Note: This is not when our file finished posting to our
    // service or when s3 finished writing to the bucket
    file.on('end', () => {
      console.log('File [' + fieldname + '] Finished')
    })
  })

  // We are going to ingnore fields for this example but
  // you could easly post extra data along with a file
  // and handle it here
  form.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {})

  form.on('finish', () => {

    // It's important to note that `Promise.all` fails fast.
    // Meaning if anyone of our requests to s3 fail, then the
    // promise `catch` handler is triggered and the rest of the
    // requests automatically fail.
    Promise.all(uploads)
      .then((results) => {

        // we use the 201 http code to indicate
        // we "created" a resource
        res.status(201).send(results)
      })
      .catch((err) => {
        console.error('Failed to upload file', err)
        res.status(500).end()
      })
  })

  // `req` is a readable stream which pipes to `form`
  // our writable stream instance busboy gave us
  req.pipe(form)

})

api.listen(3001)
