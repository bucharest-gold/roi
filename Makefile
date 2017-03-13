test: lint
	npm test

ci: test
	npm run dependencyCheck
	npm run docs

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules docs publish coverage *.txt *.svg *.cpuprofile

node_modules: package.json
	npm install

.PHONY: node_modules