const { create } = require('domain');
const fs = require('fs') // kniznica file system
const http = require('http') // kniznica http

const server = http.createServer((request, response) => {
    console.log(request);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    
    response.end('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>Hi</h1></body></html>');
});

server.listen(8080, 'localhost', () => {
    console.log('I\'m listening');
})

fs.readFile('C:\\Users\\emari\\projects\\VAVJS\\prednasky\\p2.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString())
})