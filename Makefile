test: lint
	npm test

ci: test
	npm run coverage
	npm run dependencyCheck

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules

node_modules: package.json
	npm install

.PHONY: node_modules