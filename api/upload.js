'use strict'

const dotenv = require('dotenv')
const AWS = require('aws-sdk')

dotenv.load()

module.exports = function upload(bucket, stream, filename, mimetype, acl) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  // By wrapping our our `s3.upload` call we can
  // build up an array of requests and then resolve
  // our initial service request once they all complete
  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: bucket,
      Key: filename,
      ACL: acl,
      Body: stream,

      // It's important we set a `ContentType` so when the file
      // is requested from s3 it can properly tell the requesting client
      // how to handle it. e.g. if it's an image the browser should show it.
      ContentType: mimetype
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
