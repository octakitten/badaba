const https = require('https');
const fs = require('fs')
const path = require('path');
const mime = require('mime');
const crypto = require("crypto");

const directoryPath = __dirname;
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
                key: fs.readFileSync(path.join(directoryPath, certFilePath)),
                format: "pem",
                passphrase: password,
            });
            console.log(`Access granted to username: ${username}. Correct password.`);
                   
            fs.stat(filePath, (err, stats) => {
            let file_type = mime.getType(filePath);
            if (err) {
                res.writeHead(404);
                res.end("Page not found!");
                return;
            }
            if (stats.isFile()) {
                if (file_type == 'html') {
                    res.writeHead(200, { 'Content type': mime.getType(filePath) });
                    res.createReadStream(filePath).pipe(res);
                 } else if (file_type == 'jpg') {
                    res.writeHead(200, { 'Constent type': file_type });
                    res.createReadStream(filePath.pipe(res));
                } else if (file_type == 'png') {
                    res.writeHead(200, { 'Constent type': file_type });
                    res.createReadStream(filePath.pipe(res));
                } else if (file_type == 'txt') {
                    res.writeHead(200, { 'Constent type': file_type });
                    res.createReadStream(filePath.pipe(res));
                } else if (file_type == '') {
                    res.writeHead(200, { 'Constent type': file_type });
                    res.createReadStream(filePath.pipe(res));
                }
           } else {
                res.writeHead(403);
                res.end("Access denied");
                console.log("Access denied to a request for a file due to: wrong filetype");
            }
        });
        }  catch (err) {
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
