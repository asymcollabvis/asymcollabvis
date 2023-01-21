#!/bin/bash

docker run --name=proxy -d --platform linux/amd64 \
        -v /Users/waitong/PhD/cross-device-collab/proxy/envoy.yaml:/etc/envoy/envoy.yaml:ro \
        -v /Users/waitong/PhD/cross-device-collab/proxy/cert.pem:/etc/server.crt:ro \
        -v /Users/waitong/PhD/cross-device-collab/proxy/key.pem:/etc/server.key:ro \
        -p 8081:8081 \
        envoyproxy/envoy:v1.14-latest

        
# docker run --name=proxy -d --platform linux/amd64 -v D:/Projects/asymmetric-collab-dev/proxy/envoy.yaml:/etc/envoy/envoy.yaml:ro -v D:/Projects/asymmetric-collab-dev/proxy/cert.pem:/etc/server.crt:ro -v D:/Projects/asymmetric-collab-dev/proxy/key.pem:/etc/server.key:ro -p 8081:8081 envoyproxy/envoy:v1.14-latest 