let
  pkgs = import (builtins.fetchGit {
    name = "nixos-unstable";
    url = "https://github.com/NixOS/nixpkgs/";
    ref = "refs/heads/nixpkgs-unstable";
    rev = "e6f23dc08d3624daab7094b701aa3954923c6bbb";
  }) {};
  username = builtins.readFile ./username.txt
  password = builtins.readFile ./password.txt
in pkgs.mkShell {
  packages = [
  pkgs.bash
  pkgs.openssl_oqs
  pkgs.node_24
  ];
  shellHook = ''
    cert.sh
    keygen.sh ${username} ${password}
    node install
    node server.js
    '';
  }
    
