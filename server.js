const https = require('https');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const crypto = require("crypto");
const { exec } = require("child_process");
const { spawn } = require("child_process");

const directoryPath = path.join(__dirname, "/index");
const rootPath = __dirname;
const certFile = "private-key-";

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

let process_output = "";

function make_dir_html(file_url, files) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BADABA!</title>
            <style>
            body { font-family: Arial, sans-serif; }
            ul { list-style-type: none; padding: 0 }
            li { margin: 10px 0; }
            a { text-decoration: none; color: #1e90ff; }
            a:hover { color: #4682b4; }
        </style>
    </head>
    <body>
        <h1>BADABA!</hq>
        <p>Files and folders:</p>
        <ul>`;

    files.forEach(file => {
        html += `<li><a href="${file_url}${file}" target="_blank">${file}</a></li>`;
    });

    html += `
            </ul>
        </body>
        </html>`;

    return html;
    }
    

const server = https.createServer(options, (req, res) => {
    const filePath = path.join(rootPath, req.url);
    const auth = req.headers["authorization"];

    // first we get user authentication
    // we need to create the user credentials beforehand,
    // while manually logged into the server
    //
    // then we can enter them when first accessing the server at any address
    if (!auth) {
        res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Secure Area"' });
        res.end("Authentication required.");
            return;
    }
    const base64Credentials = auth.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = credentials.split(":");
    let certFilePath = `${certFile}${username}.pem`;
    // check if pw is right
    try {
        const privateKey = crypto.createPrivateKey({
            key: fs.readFileSync(path.join(rootPath, certFilePath)),
            format: "pem",
            passphrase: password,
        });
        console.log(`Access granted to username: ${username}. Correct password.`);
        fs.stat(filePath, (err, stats) => {
            // handle bad url first
            if (err) {
                res.writeHead(404);
                res.end("Page not found!");
                console.log(err);
                console.log(`404 error at ${filePath}`);
                return;
            }
            // handle directories here
            if (stats.isDirectory()) {
                // if we try to get to the base homepage, redirect to the index
                if (req.url === "/" || req.url === "") {
                    req.url = "/index";
                };
                // first see if we need to view stdout of a running script
                if (req.url === "/index/view") {
                    res.writeHead(200,{ "Content-Type": "text/plain"});
                    res.end(process_output);
                // next see if we need to return to the main index
                } else if (req.url === "/index") {
                    fs.readdir(directoryPath, (err, files) => {
                        if (err) {
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Server error: failed to get directory");
                            return;
                        }

                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(make_dir_html(files));
                        res.end();
                    });
                // and lastly handle navigating sub directories
                } else {
                    fs.readdir(filePath, (err, files) => {
                        if (err) {
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Server error: failed to get directory");
                            return;
                        }

                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(make_dir_html(req.url, files));
                        res.end();
                    });
                }  
            }
            // handle files here
            if (stats.isFile()) {
                let file_name = path.basename(filePath);
                let file_type = mime.getType(filePath);
                // file types aren't ordered well but the gist of it is that
                // text files and pdfs are rendered in the browser 
                // and other files are served as downloads
                //
                // html
                 if (file_type == 'text/html') {
                     res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                     });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // jpg
                } else if (file_type == 'image/jpeg') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // png
                } else if (file_type == 'image/png') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // plain text
                } else if (file_type == 'text/plain') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // css
                } else if (file_type == 'text/css') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // gif
                } else if (file_type == 'image/gif') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // mp4
                } else if (file_type == 'video/mp4') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // csv
                } else if (file_type == 'text/csv') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // javascript
                // rendered in browser
                } else if (file_type == 'application/javascript') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // json
                // sent as a download
                } else if (file_type == 'application/json') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // xml
                // sent as a download
                } else if (file_type == 'application/xml') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // pdf
                } else if (file_type == 'application/pdf') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // zip archive
                } else if (file_type == 'application/zip') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                    console.log(`Serving file of type ${file_type} at ${filePath}`);
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                // bash script
                    // WARNING!!!
                    // this is an important one because bash scripts kept on the server
                    // are executed in a child process rather than served to the user
                    // don't put a bash script on the server in or below the index directory
                    // unles you're okay with or want users to run it on your server
                    //
                    // additionally, it'll log the stdout of the process until it exits
                    // you can view this output by entering the /view-output url
                } else if (file_type == 'application/x-sh') { 
                    const script_process = spawn("bash", [filePath]);
                    script_process.stdout.on("data", (data) => {
                        process_output += data;
                        console.log(`Script output: ${data}`);
                    });
                    script_process.stderr.on("data", (data) => {
                        console.error(`Script error output: ${data}`);
                    });
                    script_process.on("close", (code) => {
                        console.log(`Script completed with code ${code}`);
                    });
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(`Script output:\n${process_output}`); 
                } else {
                    res.writeHead(403);
                    res.end("Access denied");
                    console.log("Access denied to a request for a file due to: wrong filetype");
                } 
            }
        }); 
        // handle password faiure here
        // TODO lock down auth entry after too many failed attempts
    } catch (err) {
        console.log(`Attempted to check password with: ${certFilePath}`);
        console.log(`Access denied, incorrect password.`);
        res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Secure Area"' });
        res.end("Invalid credentials.");
    }
});

const PORT = 8443;
server.listen(PORT, () => {
    console.log(`HTTPS server running at https://localhost:${PORT}/`);
});


