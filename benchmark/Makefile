bench: lint
	./server-start.sh
	eval time node benchmark1.js
	./server-stop.sh
	./server-start.sh
	eval time node benchmark2.js
	./server-stop.sh
	./server-start.sh
	eval time node benchmark3.js
	./server-stop.sh
	./server-start.sh
	eval time node benchmark4.js
	./server-stop.sh

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules

node_modules: 
	npm install

.PHONY: node_modules