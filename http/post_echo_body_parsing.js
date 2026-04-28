import http from "http";

const server = http.createServer((req, res) => {

    if (req.method === "POST" && req.url === "/echo") {
        let chunks = [];

        req.on("data", (chunk) => {
            chunks.push(chunk);
        });

        req.on("end", () => {
            const body = Buffer.concat(chunks).toString();
            const contentType = req.headers["content-type"];

            if (contentType && contentType.includes("application/json")) {
                try {
                    const parsed = JSON.parse(body);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ received: parsed }));
                } catch (err) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Malformed JSON", detail: err.message }));
                }
            }
            
            else if(contentType && contentType.includes("application/x-www-form-urlencoded")){
                try{
                    const parsed = Object.fromEntries(new URLSearchParams(body));
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({received: parsed}));
                } catch (err){
                    res.writeHead(400, {"Content-Type" : "application/x-www-form-urlencoded"});
                    res.end(JSON.stringify({error: "Not a form value", detail: err.message}));
                }
            }
            
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(body));
            }
        });

        req.on("error", (err) => {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
        })
    }
    
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "ERROR", detail: "Not Found" }));
    }

    
})

const PORT = 3000;

server.listen(PORT, () => {
    console.log("server is listening on port ", PORT);
});