#!/bin/sh
# set -ex
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://159.223.28.22:5001", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
# ls
