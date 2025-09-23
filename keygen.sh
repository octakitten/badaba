#!/bin/bash
# argument 1 to this script should be a username,
# and argument 2 should be a password.
# the script will encrypt the password and associate it with the 
# username, misuse it and it will mess up i think.
uname="$(cat username.txt)"
pword="$(cat password.txt)"
openssl genpkey -algorithm RSA -out private-key-$uname.pem -aes256 -pass pass:$pword
