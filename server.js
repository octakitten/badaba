const https = require('https');
const fs = require('fs')
const path = require('path');
const mime = require('mime');
const crypto = require("crypto");

const directoryPath = __dirname;
const rootPath = __dirname;
const certFile = "private-key-";

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, (req, res) => {
    const filePath = path.join(directoryPath, req.url);
    const auth = req.headers["authorization"];

    if (!auth) {
        res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Secure Area"' });
        res.end("Authentication required.");
            return;
    }
    const base64Credentials = auth.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = credentials.split(":");
    let certFilePath = `${certFile}${username}.pem`;
    try {
        const privateKey = crypto.createPrivateKey({
            key: fs.readFileSync(path.join(rootPath, certFilePath)),
            format: "pem",
            passphrase: password,
        });
        console.log(`Access granted to username: ${username}. Correct password.`);
               
        fs.stat(filePath, (err, stats) => {
            let file_type = mime.getType(filePath);
            if (err) {
                res.writeHead(404);
                res.end("Page not found!");
                console.log(err);
                console.log(`404 error at ${filePath}`);
                return;
            }
            if (req.url === "/index") {
                fs.readdir(directoryPath, (err, files) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Server error: failed to get directory");
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write("<html><body><h2><File Directory</h2><ul>");

                    files.forEach((file) => {
                        const filePath = path.join(directoryPath, file);
                        const fileUrl = `/index/${filePath}`;

                        res.write(`<li><a href="${fileUrl}">${file}</a></li`);
                    });

                    res.end("</ul></body></html>");
                });
            }
            if (stats.isFile()) {
                let file_name = path.basename(filePath);
                 if (file_type == 'text/html') {
                     res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size});
                } else if (file_type == 'image/jpeg') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'image/png') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'text/plain') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'text/css') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                    });
                } else if (file_type == 'image/gif') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'video/mp4') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'text/csv') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'application/javascript') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'application/json') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'application/xml') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                } else if (file_type == 'application/pdf') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size},);
                } else if (file_type == 'application/zip') {
                    res.writeHead(200, { 
                        "Content-Type": mime.getType(filePath),
                        "Content-Length": stats.size,
                        "Content-Disposition": `attachment; filename="${file_name}"`,
                    });
                }

                console.log(`Serving file of type ${file_type} at ${filePath}`);
                const readStream = fs.createReadStream(filePath);
                readStream.pipe(res);
            } else {
                res.writeHead(403);
                res.end("Access denied");
                console.log("Access denied to a request for a file due to: wrong filetype");
            } 
            
        });
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


