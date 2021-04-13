import fetch from 'node-fetch'
import assert from "assert"

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

function isSubsequence(str1, str2){
  let index1 = 0
  for (let index2 = 0; index2 < str2.length; index2++) {
    if(str1[index1]===str2[index2]){
      index1++
    }
    if(index1 === str1.length){
      return true
    }
  }
  return false
}

function testIsSubsequence(){
  const string = "aabbccdd"

  const subsequence1 = "aabb"
  const subsequence2 = "abc"
  const subsequence3 = "dd"
  const subsequence4 = ""

  const notSubsequence1 = "abcde"
  const notSubsequence2 = "aaab"
  const notSubsequence3 = "dc"

  assert(isSubsequence(subsequence1,string))
  assert(isSubsequence(subsequence2,string))
  assert(isSubsequence(subsequence3,string))
  assert(isSubsequence(subsequence4,string))

  assert(isSubsequence(notSubsequence1,string) === false)
  assert(isSubsequence(notSubsequence2,string) === false)
  assert(isSubsequence(notSubsequence3,string) === false)
}

function createHashTable(existing_codes){
  const hashTable = {}
  existing_codes.forEach(element => {
    hashTable[element] = element
  })
  return hashTable
}

function createRandomCode(codeSize){
    var result           = [];
    //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var characters = 'BCDFGHJKLMNPQRSTVWXYZ0123456789'; // Remove vowels to reduce false positives
    var charactersLength = characters.length;
    for ( var i = 0; i < codeSize; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

function createRandomCodes(codeSize, numberOfCodes){
  const randomCodes = [];
  for (let i = 0; i < numberOfCodes; i++) {
    randomCodes.push( createRandomCode(codeSize) )
  }
  return randomCodes
}

function insertWordIntoCode(word, code){
  const wordLength = word.length
  const codeLength = code.length
  let responseCode = ""
  if(codeLength < wordLength){
    return code; // Impossible to fit word as subsequence
  }
  let indexWord = 0
  let indexCode = 0
  for (indexCode = 0; indexCode < codeLength; indexCode++) {
    const remainingChars = wordLength - indexWord
    const remainingSpace = codeLength - indexCode;
    if(remainingChars == remainingSpace){
      return responseCode.concat(word.substring(indexWord))
    } else if(remainingChars == 0){
      return responseCode.concat(code.substring(indexCode))
    }else{
      if(Math.random() > 0.5){
        responseCode = responseCode.concat(word[indexWord])
        indexWord++;
      }else{
        responseCode = responseCode.concat(code[indexCode])
      }
    }
  }
  return responseCode
}

function createSubsequenceCodes(codeSize, numberOfCodes, possibleDistractingWords){
  const randomCodes = createRandomCodes(codeSize, numberOfCodes)

  const subsequenceCodes = randomCodes.map( code => {
    const randomDistractingWord = possibleDistractingWords[Math.floor(Math.random() * possibleDistractingWords.length)];
    return insertWordIntoCode(randomDistractingWord, code)
  })

  return subsequenceCodes
}

// The problem:
//   Given a set of strings 'distracting_words' and a query string 'code' return
//   if 'isSubsequence(word,code)' is true for any 'word' ∈ 'distracting_words'

// We will call:
//   N - the size of q
//   M - the combined size of all A strings
//   k - the number of elements in set A

// This function is O(N*M)
// This function is very straightforward
function myFunctionZero(code, distracting_words, existing_codes){

  if(existing_codes[code]!=undefined){
    return false
  }

  let hasDistractingWordSubsequence = false;
  distracting_words.forEach(distractingWord => {
    if(isSubsequence(distractingWord,code)){
      hasDistractingWordSubsequence = true;
      // console.log("distracting word: ", distractingWord + "\ncode: ", code);
    }
  });

  return !hasDistractingWordSubsequence;
}

// This function is O(N*K)
function myFunctionOne(code, distracting_words, existing_codes){

  if(existing_codes[code]!=undefined){
    return false
  }

  const current = []
  const size = []
  for (let i = 0; i < distracting_words.length; i++) {
    current.push(0)
    size.push(distracting_words[i].length)
  }

  for (let i = 0; i < code.length; i++) {
    const currentCodeChar = code[i];
    for (let j = 0; j < distracting_words.length; j++) {
      if(currentCodeChar === distracting_words[j][current[j]]){
        current[j]++;
      }
      if(current[j]===size[j]){
        // console.log("distracting word: ", distracting_words[j] + "\ncode: ", code);
        return false; // Found a subsequence
      }
    }
  }

  return true;
}

const URL = 'https://gist.githubusercontent.com/dlants/d3b25b0f6c0bf8d023f65e86498bf9e6/raw/b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt'
const CODE_SIZE = 10
const MAXIMUM_DISTRACTING_WORD_SIZE = 8 // This should be lower or equal than CODE_SIZE
const MINIMUM_DISTRACTING_WORD_SIZE = 6
const TOTAL_NUMBER_OF_EXISTING_RANDOM_CODES = 1000000
const TOTAL_NUMBER_OF_TEST_RANDOM_CODES = 1000
const TOTAL_NUMBER_OF_SUBSEQUENCE_CODES = 1000
const REPEAT_DICTIONARY_TIMES = 1

console.log("Fetching dictionary")
const fetchedDictionary = await fetchDictionary(URL)
console.log("Dictionary fetched ")

const distractingWords = dictionaryToUpperCase(fetchedDictionary)
const possibleDistractingWords = distractingWords.filter(word => word.length <= MAXIMUM_DISTRACTING_WORD_SIZE && word.length >= MINIMUM_DISTRACTING_WORD_SIZE)


console.time('createData')
console.log("Creating sample data.")
const repeatedDistractingWords = []
for (let i = 0; i < REPEAT_DICTIONARY_TIMES; i++) {
  repeatedDistractingWords.push(...possibleDistractingWords)
}
console.log("Possible distracting words: ", repeatedDistractingWords)

const existingRandomCodes = createRandomCodes(CODE_SIZE, TOTAL_NUMBER_OF_EXISTING_RANDOM_CODES)

const testRandomCodes = createRandomCodes(CODE_SIZE, TOTAL_NUMBER_OF_TEST_RANDOM_CODES)

const subsequenceCodes = createSubsequenceCodes(CODE_SIZE, TOTAL_NUMBER_OF_SUBSEQUENCE_CODES, possibleDistractingWords)

// console.log("random codes: ", randomCodes)
console.log("test random codes: ", testRandomCodes)
console.log("subsequenceCodes: ", subsequenceCodes)
console.log("Sample data created.")
console.timeEnd('createData')


console.time('createHashTable')
console.log("Creating hash table")
const hashTable = createHashTable(existingRandomCodes)
console.timeEnd('createHashTable')


console.log("\n\n----Algorithm 0:----\n\n")
console.log("Start testing with random codes")
console.time('randomCodes')
testRandomCodes.forEach(testRandomCode => {
  const returnValue = myFunctionZero(testRandomCode, repeatedDistractingWords, hashTable)
  assert(returnValue, "Failed on " + testRandomCode)
})
console.timeEnd('randomCodes')

console.log("All random passed as valid")
console.log("Will now test codes with distracting words subsequence")

console.time('subsequenceCodes')
subsequenceCodes.forEach(subsequenceCode => {
  const returnValue = myFunctionZero(subsequenceCode, repeatedDistractingWords, hashTable)
  assert(!returnValue, "Failed on " + subsequenceCode)
})
console.timeEnd('subsequenceCodes')

console.log("All subsequence passed as invalid")



console.log("\n\n----Algorithm 1:----\n\n")
console.log("Start testing with random codes")
console.time('randomCodes')
testRandomCodes.forEach(testRandomCode => {
  const returnValue = myFunctionOne(testRandomCode, repeatedDistractingWords, hashTable)
  assert(returnValue, "Failed on " + testRandomCode)
})
console.timeEnd('randomCodes')

console.log("All random passed as valid")
console.log("Will now test codes with distracting words subsequence")

console.time('subsequenceCodes')
subsequenceCodes.forEach(subsequenceCode => {
  const returnValue = myFunctionOne(subsequenceCode, repeatedDistractingWords, hashTable)
  assert(!returnValue, "Failed on " + subsequenceCode)
})
console.timeEnd('subsequenceCodes')

console.log("All subsequence passed as invalid")