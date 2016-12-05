## Benchmarks

> Benchmarks are notoriously a lot like statistics so take this with a grain of salt. 
> Results from a simplified, non-scientific benchmark performed on a Lenovo T440 Linux 4.8.4-1-ARCH x86_64.
> Your results may vary.

### Note 1

Some modules has no built-in support for promises. So since `roi` is using `Fidelity` as promise implementation, 
when a specific module has no support for promise, `Fidelity` was used to make a more fair comparison.

### Note 2

Some modules **has** built-in support for promises. Some of them are using `bluebird` as promise implementation.
Since `roi` is using `Fidelity` then it will loose a bit due performance differences between `Fidelity` 
and `bluebird`.

### How to run

Go to benchmark directory and run `make`

_You will need python2 installed._

### Results

```
[hf@archT440 benchmark]$ make
npm install
npm run lint

> benchmark-test@0.0.1 lint /mnt/ddisk/dev/roi/benchmark
> eslint .

./server-start.sh
node roi_node.js
node x 527 ops/sec ±1.73% (84 runs sampled)
roi x 528 ops/sec ±1.33% (83 runs sampled)
./server-stop.sh
./server-start.sh
node roi_wreck.js
wreck x 534 ops/sec ±1.81% (83 runs sampled)
roi x 514 ops/sec ±1.52% (82 runs sampled)
./server-stop.sh
./server-start.sh
node roi_request.js
request x 455 ops/sec ±1.99% (83 runs sampled)
roi x 519 ops/sec ±1.49% (86 runs sampled)
./server-stop.sh
./server-start.sh
node roi_fetch.js
node-fetch x 518 ops/sec ±2.00% (75 runs sampled)
roi x 521 ops/sec ±1.29% (87 runs sampled)
./server-stop.sh
./server-start.sh
node roi_request-promise.js
request-promise x 446 ops/sec ±2.19% (84 runs sampled)
roi x 524 ops/sec ±1.09% (86 runs sampled)
./server-stop.sh
```
