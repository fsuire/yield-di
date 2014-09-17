bins = ./node_modules/.bin

clean:
	@rm -rf html-report

istanbulInstrumentation:
	@$(bins)/istanbul instrument --output lib-cov lib
	@echo

runTest:
	@NODE_ENV=test \
	$(bins)/mocha --harmony \
	--reporter spec \
	\
	./test/* \
	./test/lib/*

runCoverage:
	@NODE_ENV=test \
	COVER=1 \
	ISTANBUL_REPORTERS=text-summary,html \
	$(bins)/mocha --harmony \
	--reporter mocha-istanbul \
	./test/lib/*

cleanInstanbulInstrumentation:
	@rm -rf lib-cov

test: clean istanbulInstrumentation runTest runCoverage cleanInstanbulInstrumentation

justtest: clean runTest

justcover: clean istanbulInstrumentation runCoverage cleanInstanbulInstrumentation

.PHONY: test