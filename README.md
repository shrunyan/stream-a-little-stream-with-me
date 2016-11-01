# Stream a Little Stream with Me
_How to stream a file upload from the browser to S3 using node.js._

__Prerequisites__

- aws account
- user/role with permissions configured
  - access id
  - access secret
- s3 bucket

## Why Streaming
Probably the largest reason you should be considering using streams is _performance_. The performance of streams are two fold;

- Avoiding disk I/O
- Lower memory consumption

### Avoiding disk I/O
Using a stream allows us to avoid temporarly writing the uploaded file to our server's disk. This not only avoids the costs of writing the file but also reduces the disk size of our service servers. As well as reduces complexity of dealing with clean code to ensure temp files are properly removed.

### Lower memory consumption
Streams work by buffering only the current data they are dealing with. How much is buffered is also a configurable value.

> (The amount of data potentially buffered depends on the highWaterMark option passed into the streams constructor.)[https://nodejs.org/api/stream.html#stream_buffering]

Since we only buffer the data being dealt with a larger, say 200mb file, does not have to be fully buffered and allocate that memory.

## Handling Preflight
Since we will be initiating a CORS (Cross-Origin Resource Sharing) request we will need to deal with browser preflighting. A preflight request is when the browser sends an `OPTIONS` request before the actual request. It consists of headers telling the service what it's about to request. The server can then inspect these headers and respond appropriately.

_This is one of those details I always forget about untill I bump into it._

## Multi-part body parsing
Since this is going to be a file upload it will have a multi-part body. This is important to note that way we pick an appropriate express body parser. We are going to use `busboy` since it will give us a proper readable stream.

Multi-part body parsing can be expensive and not as friendly to work with. Generally nice to avoid unless dealing with file uploads.

## Types of Streams
Node provides us four types of streams; Readable, Writable Duplex (both readable and writable) and Transform streams. One of the greatest things about streams is that they handle the buffer and flow control for internally for you. This means as a stream consumer you don't have to worry about back pressure.

## Mimetypes
When dealing with file uploads it's very important to determine the mimetype and ensure it's properly set with in your storage provider as a ContentType. The ContentType of a file is what is used to inform the browser how to handle it. When you don't have your ContentType set properly usually it will be defaulted to an `Octet-stream`. For something like an image this when then trigger the browser to download it instead if displaying the image.

### Magic Number
These are the first few characters of a file which can be used to determine it's mimetype. We are using the `busboy` package which determines the mimetype for you but if you wanted to you could read the first few characters of your stream and determine the mimetype yourself via the magic number.

## Access Control List (acl)
When we post a file to our storage provider we will need to specify an acl. The acl is what determines the permissions on the file. In our case we want these to be publicly readable so we set the AWS acl of `public-read`. We could also make these private if they are not intended to be served out of the s3 bucket.

## Streams 2 vs 3
An important history item to be aware of is that there are two versions of the stream API. Most packages should be using the latest, streams 3, but it's important to be aware of if you experience inconsitent behavior using a package. 

__Notes__

Missing the end of your file?
The connection to your provider was closed before the data finished writing. Usally an asynchronous timing issue or imporperly ending a stream.
