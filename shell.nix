let
  pkgs = import (builtins.fetchGit {
    name = "nixos-unstable";
    url = "https://github.com/NixOS/nixpkgs/";
    ref = "refs/heads/nixpkgs-unstable";
    rev = "e6f23dc08d3624daab7094b701aa3954923c6bbb";
  }) {};
in pkgs.mkShell {
  packages = [
  pkgs.bash
  pkgs.openssl_oqs
  pkgs.node_24
  ];
  shellHook = ''
    cert.sh
    keygen.sh
    node install
    node server.js
    '';
  }
    
