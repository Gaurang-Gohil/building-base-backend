import http from "http";

const server = http.createServer((req, res) =>{
    console.log("Method : ", req.method ,"\nURL : ", req.url, "\n");

    // if(req.url === "/"){
    //     res.writeHead(200, {"Content-Type" : "text-plain"});
    //     res.end("Home\n");
    // }
    // else if(req.url === "/about"){
    //     res.writeHead(200, {"Content-Type" : "text-plain"});
    //     res.end("About\n");
    // }
    // else{
    //     res.writeHead(404, {"Content-Type" : "text-plain"});
    //     res.end("Not Found\n");
    // }

    switch(req.url) {
        case "/": {
            res.writeHead(200, {"Content-Type" : "application/json"});
            res.end(JSON.stringify({ message: "ok", detail: "home" }));
            break;
        }

        case "/about": {
            res.writeHead(200, {"Content-Type" : "application/json"});
            res.end(JSON.stringify({ message: "ok", detail: "about" }));
            break;
        }

        default: {
            res.writeHead(404, {"Content-Type" : "application/json"});
            res.end(JSON.stringify({ message: "ERROR", detail: "Not Found" }));
            break;
        }
    }

})

const PORT = 3000;

server.listen(PORT, () =>{
    console.log("Server is running on PORT", PORT);
})