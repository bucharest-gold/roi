# roi

A simple promisified http client library with zero deps.

* JSON.
* Basic auth.
* GET, POST, PUT, DELETE[soon], UPLOAD[soon].
* 0 [zero] deps.


    roi({port:3000}).get('/posts')
    .then(x => console.log(x))
    .catch(e => conole.log(e));

    roi({port:3000}).post('/posts', {foo:1, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => conole.log(e));

    roi({port:3000}).put('/posts/123', {foo:4, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => conole.log(e));