import React from 'react'
export default class extends React.Component {
  handleSubmit = (evt) => {
    // Literaly what it says, don't let the native form
    // submission behavior occur. We are going to handle it.
    evt.preventDefault()

    // We start by ensuring we have a file to submit
    let input = evt.target.querySelector('input')
    if (!input.files.length) {
      return false
    }

    // We use xhr because the newer `fetch` api
    // unfortunately does not give us a progress event
    let xhr = new XMLHttpRequest()
    let form = new FormData()

    // Iterate of our list of files and append them
    // to our form data. Allows handling of mulitple
    // file uploads.
    for (let i = input.files.length - 1; i >= 0; i--) {
      form.append(`file-${i}`, input.files[i])
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.OPENED) {
        // UPLOADING
      }

      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (/200|201/.test(xhr.status)) {
          if (xhr.responseText) {
            const json = JSON.parse(xhr.responseText)
            // UPLOAD DONE
            console.log('SUCCESS', json)
          }
        } else {
          // SOME THING ELSE HAPPENED
          console.error('FAILED', xhr)
        }
      }
    }

    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        // This is the progress of the file data going to our
        // service. Not when the request has responded with a status code
        // i.e. You can see the progress sit at 100 for awhile well the
        // service waits for the file to upload to s3.
        console.log('progress: ', Math.round((evt.loaded * 100) / evt.total))
      }
    })

    xhr.upload.addEventListener('abort', (evt) => {
      console.error('request aborted', evt)
    })

    xhr.upload.addEventListener('error', (evt) => {
      console.error('request failed', evt)
    })

    // open a connection to our api
    xhr.open('POST', 'http://localhost:3001/upload')

    // if you have server authentication you will most
    // likely need to include `withCredentials` this tells
    // the browser to include cookies with the request
    // xhr.withCredentials = true

    // calling `send()` is what starts are upload
    xhr.send(form)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" multiple />
          <button>Send</button>
        </form>
      </div>
    )
  }
}
