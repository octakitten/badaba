#!/bin/bash
# argument 1 to this script should be a username,
# and argument 2 should be a password.
# the script will encrypt the password and associate it with the 
# username, misuse it and it will mess up i think.
if [ $# -ne 2 ]; then
 echo "Usage: $0 <username> <password>"
 exit 1
fi

uname="$1"
pword="$2"
openssl genpkey -algorithm RSA -out private-key-$uname.pem -aes256 -pass pass:$pword
