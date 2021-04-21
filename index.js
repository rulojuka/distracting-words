import testWithDefaultValues from './test/stress/RandomStressTest.js'
import testAll from './test/unit/ClassCodeValidatorTest.js'
import getDictionary from './src/DictionaryService.js'

const URL =
  'https://gist.githubusercontent.com/dlants/d3b25b0f6c0bf8d023f65e86498bf9e6/raw/b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt'

console.log('Fetching dictionary')
const distractingWords = await getDictionary(URL)
console.log('Dictionary fetched ')

// testWithDefaultValues(distractingWords)

console.log('Testing ClassCodeValidator')
testAll()
console.log('Tested.')
