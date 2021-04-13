# distracting-words

## Running the code

A simple

```
npm install
npm test
```

should be enough

## Structure

The important files are [src/ClassCodeValidator.js](src/ClassCodeValidator.js) and [test/unit/ClassCodeValidatorTest.js](test/unit/ClassCodeValidatorTest.js).
The other files are given as boilerplate code and would probably not go to review/production.

## Things to discuss

### Algorithm expected running time and the better algorithm

- There is a better algorithm but it is a little more complex. Taking into consideration the maintainability and also the probable constraints on the parameters, I chose the simpler one to implement. (It was written still on `solutions.txt`)

### No test framework

- I figured that characteristics like test coverage, orthogonality, naming and maintainability would be more explicit if I avoided any test framework such as `mocha`, `jest`, etc. Because of this, there is a loss in legibility in the tests report.

### One assert per test

- I chose to put more than one assert in some of the tests to improve legibility. That is often a team/project decision and can be easily changed in this case.

### RandomStressTest

- As a part of measuring the quality of algorithm in practice, I wrote a test case generator. This was only kept for discussion purposes, and would not go to review/production in a work environment.

### Invalid arguments should throw exceptions

- As a standalone application, I have not written error handling code. Because of this, I decided to just return `false` instead of throwing the adequate exceptions. This is easily changed if needed.

### References

- Just for fun, I did a quick research to find better algorithms. There are some that uses tries to solve related problems, but this specific one seems to be optimal in `O(N*K)` (query string length times number of distracting words) or much more complex, using automaton or tries (also known as prefix trees).
