import fetch from 'node-fetch'
import testWithDefaultValues from './test/RandomStressTest.js'
import testIsSubsequence from './test/DistractingWordsServiceTest.js'

async function fetchDictionary(URL){
  let dictionary
  await fetch(URL).then(
    (res) => res.text()
  ).then(
    (text) => {
    dictionary = text.split('\n')
  }).catch( 
    (error) => console.error("Could not fetch dictionary" + error)
  )
  return dictionary
}

function dictionaryToUpperCase(dictionary){
  return dictionary.map(word => word.toUpperCase());
}

const URL = 'https://gist.githubusercontent.com/dlants/d3b25b0f6c0bf8d023f65e86498bf9e6/raw/b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt'

console.log("Fetching dictionary")
const fetchedDictionary = await fetchDictionary(URL)
console.log("Dictionary fetched ")
const distractingWords = dictionaryToUpperCase(fetchedDictionary)

const MAXIMUM_DISTRACTING_WORD_SIZE = 8 // This should be lower or equal than CODE_SIZE
const MINIMUM_DISTRACTING_WORD_SIZE = 6
const possibleDistractingWords = distractingWords.filter(word => word.length <= MAXIMUM_DISTRACTING_WORD_SIZE && word.length >= MINIMUM_DISTRACTING_WORD_SIZE)

testWithDefaultValues(possibleDistractingWords)

console.log("Testing isSubsequence")
testIsSubsequence();
console.log("Tested.")