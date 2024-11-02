#!/bin/bash
# argument 1 to this script should be a username,
# and argument 2 should be a password.
# the script will encrypt the password and associate it with the 
# username, misuse it and it will mess up i think.
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
    -inkey private-key-$1.pem -in certificate-$1.pem -passout pass:$2
