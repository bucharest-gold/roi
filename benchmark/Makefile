bench: lint
	./server-start.sh
	node roi_node.js
	./server-stop.sh
	./server-start.sh
	node roi_wreck.js
	./server-stop.sh
	./server-start.sh
	node roi_request.js
	./server-stop.sh
	./server-start.sh
	node roi_fetch.js
	./server-stop.sh
	./server-start.sh
	node roi_request-promise.js
	./server-stop.sh

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules

node_modules: 
	npm install

.PHONY: node_modules