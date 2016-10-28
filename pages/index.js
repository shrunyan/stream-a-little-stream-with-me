import React from 'react'
export default class extends React.Component {
  handleSubmit = (evt) => {
    evt.preventDefault()

    let input = evt.target.querySelector('input')
    let file = input.files[0]

    if (!file) {
      return false
    }

    let xhr = new XMLHttpRequest()
    let form = new FormData()

    form.append('file', file)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.OPENED) {
        // UPLOADING
      }

      if (xhr.readyState == XMLHttpRequest.DONE) {
        const json = JSON.parse(xhr.responseText)

        if (/200|201/.test(json.code)) {
          // UPLOAD DONE
          console.log('SUCCESS')
        } else {
          // SOME THING ELSE HAPPENED
          console.error('FAILED')
        }
      }
    }

    xhr.upload.addEventListener('progress', (evt) => {})
    xhr.upload.addEventListener('abort', (evt) => {})
    xhr.upload.addEventListener('error', (evt) => {})

    xhr.open('POST', 'http://localhost:3001/upload')
    // xhr.withCredentials = true
    xhr.send(form)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" />
          <button>Send</button>
        </form>
      </div>
    )
  }
}
