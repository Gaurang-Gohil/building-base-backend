6-Hour HTTP + Node.js Deep Dive Plan                                                                                                                                                                       
                                                                                                        
  Philosophy: Build everything from scratch — no Express, no frameworks. Raw http module only. Understanding breaks before abstractions.                                                                     
                                                                                                                                                                                                             
  ---                                                                                                                                                                                                        
  Hour 1 — How HTTP Actually Works (Theory Sprint)                                                                                                                                                           
                                                                                                                                                                                                             
  Goal: Know what's happening on the wire before writing a single line.                                                                                                                                      
                                                                                                                                                                                                             
  - What is HTTP? (request/response cycle, stateless protocol)                                                                                                                                               
  - Anatomy of an HTTP request: method, URL, headers, body                                                                                                                                                   
  - Anatomy of an HTTP response: status line, headers, body                                                                                                                                                  
  - TCP handshake → HTTP → response (the full round trip)                                                                                                                                                    
  - Status codes that matter: 200, 201, 204, 400, 401, 403, 404, 500                                                                                                                                         
  - Headers that matter: Content-Type, Content-Length, Authorization, Accept                                                                                                                                 
                                                                                                                                                                                                             
  Exercise: Use curl -v https://httpbin.org/get and read every line of raw output. Identify each part.                                                                                                       
                                                                                                                                                                                                             
  ---                                                                                                                                                                                                        
  Hour 2 — Your First Raw Node.js Server                                                                                                                                                                     
                                                                                                                                                                                                             
  Goal: Serve responses without any library.
                                                                                                                                                                                                             
  Build this progression:
  1. Hello World server (port 3000)                                                                                                                                                                          
  2. Read req.method and req.url — log every incoming request                             
  3. Route by URL: GET /       → 200 "Home"                                                                                                                                                                  
                   GET /about  → 200 "About"                                                                                                                                                                 
                   anything else → 404                                                                                                                                                                       
  4. Set response headers manually (Content-Type: application/json)                                                                                                                                          
  5. Send JSON back: { message: "ok" }                                                                                                                                                                       
                                                                                                                                                                                                             
  Key insight to internalize: req is a readable stream. res is a writable stream.                                                                                                                            
                                                                                                                                                                                                             
  ---                                                                                                                                                                                                        
  Hour 3 — Reading Request Bodies (The Hard Part)
                                                                                                                                                                                                             
  Goal: Understand why body parsing exists and build it yourself.
                                                                                                                                                                                                             
  1. POST /echo → read body chunks, join them, send back as-is
  2. Parse JSON body manually (no body-parser)                                                                                                                                                               
  3. Handle Content-Type: application/x-www-form-urlencoded                                                                                                                                                  
  4. Handle malformed JSON — what breaks and why                                                                                                                                                             
                                                                                                                                                                                                             
  Exercise: POST to your server with curl -X POST -H "Content-Type: application/json" -d '{"name":"gaurang"}' http://localhost:3000/echo                                                                     
                                                                                                                                                                                                             
  Key insight: The body comes in as chunks over time — that's why you need to buffer it.                                                                                                                     
                  
  ---                                                                                                                                                                                                        
  Hour 4 — Build a Mini REST API (CRUD)
                                                                                                                                                                                                             
  Goal: Apply everything on a real feature.
                                                                                                                                                                                                             
  Build an in-memory Notes API (no database yet):                                                                                                                                                            
                                                                                                                                                                                                             
  ┌────────┬────────────┬────────────────┐                                                                                                                                                                   
  │ Method │    Path    │     Action     │
  ├────────┼────────────┼────────────────┤
  │ GET    │ /notes     │ list all notes │
  ├────────┼────────────┼────────────────┤
  │ GET    │ /notes/:id │ get one note   │                                                                                                                                                                   
  ├────────┼────────────┼────────────────┤
  │ POST   │ /notes     │ create a note  │                                                                                                                                                                   
  ├────────┼────────────┼────────────────┤
  │ PUT    │ /notes/:id │ update a note  │
  ├────────┼────────────┼────────────────┤                                                                                                                                                                   
  │ DELETE │ /notes/:id │ delete a note  │
  └────────┴────────────┴────────────────┘                                                                                                                                                                   
                  
  No router library. Parse the URL with new URL(req.url, 'http://localhost') and write the routing logic yourself.                                                                                           
   
  ---                                                                                                                                                                                                        
  Hour 5 — HTTP Concepts That Bite Everyone
                                           
  Goal: Close the gaps that trip up backend devs.
                                                                                                                                                                                                             
  - Query strings: parse ?search=foo&limit=10 manually
  - HTTP vs HTTPS: what TLS adds (conceptual, not implementation)                                                                                                                                            
  - CORS: why it exists, what headers solve it — add CORS headers manually                                                                                                                                   
  - Cookies: set a Set-Cookie header, read Cookie header on next request                                                                                                                                     
  - Redirects: send a 301/302 with Location header — watch curl follow it                                                                                                                                    
                                                                                                                                                                                                             
  Exercise for each: implement it in your server, verify with curl.                                                                                                                                          
                                                                                                                                                                                                             
  ---             
  Hour 6 — Stress Test Your Mental Model
                                                                                                                                                                                                             
  Goal: Break things intentionally so the model sticks.
                                                                                                                                                                                                             
  1. Send a request with no Content-Type — what happens to your parser?                                                                                                                                      
  2. Send a 10MB body — does your server handle it?
  3. Make two simultaneous requests — does Node.js handle them? (it does — understand why: event loop)                                                                                                       
  4. Kill the server mid-response with Ctrl+C — what does the client see?                                                                                                                                    
  5. Write a simple load test with Promise.all firing 50 concurrent requests                                                                                                                                 
                                                                                                                                                                                                             
  Final exercise: Remove all your routing code and rewrite it from memory in 15 minutes.                                                                                                                     
