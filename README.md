# Stream a Little Stream with Me
__How to stream a file upload from the browser to S3__

## Prerequiste

- aws account
- permissions configured
  - access id
  - access secret
- bucket

## Why streaming?

There are 2 major reasons you should be streaming your file uploads.

### Performance
The performance implications of streaming are threefold; avoiding disk I/O, reduce memory consumption and throttling.

### Costs

Streams allow us to handle file uploads without saving files to our servers hard drive. What this means is we will not need disk space intensive servers as well as receive a performance boon from not doing I/O and handling each stream asynchronously.


## File Upload

The first thing we need is a form to handle our file upload. This will be a multipart form submission. We are going to do this old school since the newier `fetch` api does not provide a progress event.

```
const URL = 'TODO ADD URL'

let xhr = new XMLHttpRequest()
let form = new FormData()

// TODO where is the file coming from?
form.append('file', file)

xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.OPENED) {
  	// UPLOADING
  }

  if (xhr.readyState == XMLHttpRequest.DONE) {
    const json = JSON.parse(xhr.responseText)

    if (/200|201/.test(json.code)) {
			// UPLOAD DONE
    } else {
    	// SOME THING ELSE HAPPENED
    }
  }
}

xhr.upload.addEventListener('progress', (evt) => {})
xhr.upload.addEventListener('abort', (evt) => {})
xhr.upload.addEventListener('error', (evt) => {})

xhr.open('POST', URL)
xhr.send(form)

```

## Preflight

// TODO Explain preflight
// * I hit a roadblock here trying to figure out which headers need to
// be preflighted in order to handle a cors request
// * start by looking at the request from your browser and see what headers
// it requesting


## Handling the incoming upload stream

Now that we have a multipart POST we need to prepair our server to handle the request.

```
const express = require('express')
const busboy = require('busboy')
const ourS3WrapperModule = require('')

const server = express()

server.post('/upload', (req, res) => {
	let form = new busboy({
    headers: req.headers
  })

  form.on('error', (err) => {
  	res.status(500).end()
  })
  form.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
  	// We are ignoring fields
  })
  form.on('file', (fieldname, file, fileName, encoding, mimetype) => {
  	// TODO post `file` stream to S3
  })
  form.on('finish', () => {
  	res.status(201).end()
  })

	// THIS IS THE STREAM!!!
	// So `req` is a readable stream which the `form` busboy instance
	// reads and then in the `file` event above it passes a `file` readable stream handle.
  req.pipe(form)
})

```

## Multi-part body parsing

## Mimetype
// TODO explain mimetypes
// and why you need to ensure they get set properly
// e.g. you don't want a file download

## Passing file stream to S3 API

Separating our AWS S3 logic into a module for Node points and to separate the logic steps that are occuring.

```
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = function (file) {


}
```

// TODO explain on data, required to start stream
