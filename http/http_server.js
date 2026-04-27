import http from "http";

const server = http.createServer((req, res) =>{
    res.writeHead(200, {"content-type" : "text-plain"});

    res.end("Hello World!\n");
})

const PORT = 3000;

server.listen(PORT, () =>{
    console.log("Server is running on PORT", PORT);
})