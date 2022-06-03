#!/bin/bash

echo "Welcome to Zap-DB"

#npm install @openapitools/openapi-generator-cli

echo "Enter language to generate client SDK:
1. Python
2. Golang
3. Java
4. Typescript

Please enter choice number: "

read choice

case "$choice" in
    "1" ) LANGUAGE=go
    ;;
    "2" ) LANGUAGE=java 
    ;;
esac

echo "Generating client SDK in $LANGUAGE..."
    
dir = "client/$LANGUAGE"
rm -rf "dir" || true

npx @openapitools/openapi-generator-cli generate \
-i zapapi.yaml \
-g $LANGUAGE \
-o ./client/$LANGUAGE

echo "Client SDK successfully generated in $LANGUAGE!!"
