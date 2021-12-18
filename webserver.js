'use strict'

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
  '.htm' : 'text/html',
  '.css' : 'text/css',
  '.js' : 'text/javascript',
  '.gif' : 'image/gif',
  '.jpg' : 'image/jpeg',
  '.png' : 'image/png'
}

function webserver(req, res){
  let baseURI = url.parse(req.url);
  let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);

  // check id the requested file is accessible or not
  fs.access(filepath, fs.F_OK, error => {
    if(!error){
      // read and serve the file
      fs.readFile(filepath, (error, content) => {
        if(!error){
          console.log('Serving: ', filepath)
          // resolve the content type
          let contentType = mimes[path.extname(filepath)] //mine['.css'] == 'text/css'
          // serve the file from buffer
          res.writeHead(200, {'Content-type' : contentType});
          res.end(content, 'utf-8');
        }else{
          // serve a 500
          res.writeHead(500);
          res.end('The server could not read the requested file');
        }
      });
    }else{
      // serve a 404
      res.writeHead(404);
      res.end('content not found');
    }
  });
}

http.createServer(webserver).listen(3000, () => {
  console.log('Webserver running on port 3000');
})
