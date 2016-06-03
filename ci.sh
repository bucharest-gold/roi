#!/bin/bash

npm install -g json-server
json-server --watch test/fixtures/db.json &
sleep 2