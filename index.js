const express = require("express");
const {use} = require("express/lib/application");

 const app = express();
 // app.use(express.json());
 // app.use(express.urlencoded({ extended: true }));

 app.get("/users", (req, res) => {
     res.send('Hello World!');
 })

app.post("/users", (req, res) => {
   res.send('Hello World!2');
})

app.listen(3000, () => {
   console.log("Server running on http://localhost:3000/");
    });












   // const server = http.createServer((req, res) => {
   //    if (req.url === '/users' && req.method == 'GET') {
   //       res.writeHead(200, {'Content-Type': 'application/json'});
   //       res.end(JSON.stringify({
   //          data: 'Hello World!',
   //       }));
   //       return
   //    }
   //    res.writeHead(200, {'Content-Type': 'application/json'});
   //    res.end(JSON.stringify({
   //       data: 'Hello World!',
   //    }));
   // });
   //
   // server.listen(3000);


