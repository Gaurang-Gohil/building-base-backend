import http from "http";

let notes = [];
let nextId = 1;



const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname;
    const id = pathname.split("/")[2];
    const method = req.method;

    const send = (statusCode, data) => {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

    const readBody = () => new Promise((resolve) => {
        let chunks = [];
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString()))
            } catch { resolve(null); }

        })
    });

    // Routing for /notes
    if (pathname.includes("/notes")) {

        // Routing Logic -- GET 
        if (method === "GET") {
            if (pathname === "/notes") {
                send(200, { notes: notes })
            }
            else if (pathname.startsWith("/notes/")) {
                const note = notes[id];
                if (note === undefined) {
                    send(404, { error: "Note not found" });
                }
                else {
                    send(200, { note: note });
                }
            }
        }

        //  Routing Logic -- POST
        if (method === "POST") {
            const noteToAdd = await readBody();

            if (pathname === "/notes") {
                try {
                    notes.push(noteToAdd);
                    send(201, { message: "note added successfully" })
                } catch (err) {
                    send(400, { error: "Could not add the note" });
                }
            }
            else if (pathname.startsWith("/notes/") && id) {
                notes[id] = noteToAdd;
            }
        }

        // Routing Logic -- DELETE
        if (method === "DELETE") {
            if (pathname.startsWith("/notes/") && id) {
                try {
                    notes = notes.filter(n => n.id !== Number(id));
                    send(200, { message: "note deleted successfully" });
                } catch (err) {
                    send(400, { error: err });
                }
            }
        }


        // Routing Logic -- PUT
        if (method === "PUT") {
            const noteToEdit = await readBody();
            if (pathname.startsWith("/notes/")) {
                try {
                    notes[id] = noteToEdit;
                    send(200, { message: "note updated successfully"})
                } catch (err) {
                    send(400, { error: err });
                }
            }
        }
    }
    else {
        send(404, { err: "Unavailable Route" });
    }
})


const PORT = 4001;

httpServer.listen(PORT, () => {
    console.log("http server is listening on port ", PORT);
})