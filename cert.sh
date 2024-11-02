#!/bin/bash
openssl req -x509 -newkey rsa:2048 -noenc -subj '/CN=localhost' \
    -keyout key.pem -out cert.pem
