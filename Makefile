ci: lint
	npm run coverage

test: lint
	npm test

lint: node_modules
	npm run lint
	npm run format

clean:
	rm -rf node_modules coverage

node_modules: package.json
	npm install

.PHONY: node_modules