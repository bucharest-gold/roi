#!/bin/bash

kill -9 `ps -ef | grep "python2 -m SimpleHTTPServer" | head -n 1 | awk '{print $2}'`
sleep 1