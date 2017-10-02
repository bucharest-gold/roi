test: lint
	npm test

ci: test

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules publish coverage *.txt *.svg *.cpuprofile

node_modules: package.json
	npm install

.PHONY: node_modules