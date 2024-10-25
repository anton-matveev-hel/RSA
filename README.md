# RSA
RSA encryption implementation in JavaScript.

* [Specification Document](Documentation/Specification.md)
* [Implementation Document](Documentation/Implementation.md)
* [Testing Document](Documentation/Testing.md)
* Weekly Reports:
  * [Week 1](Documentation/WeeklyReports/Week1.md)
  * [Week 2](Documentation/WeeklyReports/Week2.md)
  * [Week 3](Documentation/WeeklyReports/Week3.md)
  * [Week 4](Documentation/WeeklyReports/Week4.md)
  * [Week 5](Documentation/WeeklyReports/Week5.md)
  * [Week 6](Documentation/WeeklyReports/Week6.md)
* [Coverage Report](https://github.com/anton-matveev-hel/RSA/commit/HEAD#comments)

<h3>Prerequisites</h3>
* Node.JS
* NPM

<h3>Installation</h3>
```bash
npm i
```

<h3>Running Tests</h3>

```bash
npm run test
```

<h3>Using the Tool</h3>
* CLI Help
```bash
npm run rsa --help
```
* Key Generation
```bash
node src/lib/index.js generate-keys 2048 --name my_key # yields ./my_key.public.pem and ./my_key.private.pem
```
* Encryption
```bash
node src/lib/index.js encrypt message.txt -k my_key.public.pem -o message.enc
```

* Decryption
```bash
node src/lib/index.js decrypt message.enc -k my_key.private.pem -o message.dec.txt
```
