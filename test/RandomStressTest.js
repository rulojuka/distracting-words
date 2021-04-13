import assert from 'assert'
import codeDoesNotExistAndIsNotDistracting from '../src/DistractingWordsService.js'

const createHashTable = (existingCodes) => {
  const hashTable = {}
  existingCodes.forEach((element) => {
    hashTable[element] = element
  })
  return hashTable
}

const createRandomCode = (codeSize) => {
  const result = []
  // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const characters = 'BCDFGHJKLMNPQRSTVWXYZ0123456789' // Remove vowels to reduce false positives
  const charactersLength = characters.length
  for (let i = 0; i < codeSize; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

const createRandomCodes = (codeSize, numberOfCodes) => {
  const randomCodes = []
  for (let i = 0; i < numberOfCodes; i++) {
    randomCodes.push(createRandomCode(codeSize))
  }
  return randomCodes
}

const insertWordIntoCode = (word, code) => {
  const wordLength = word.length
  const codeLength = code.length
  let responseCode = ''
  if (codeLength < wordLength) {
    return code // Impossible to fit word as subsequence
  }
  let indexWord = 0
  let indexCode = 0
  for (indexCode = 0; indexCode < codeLength; indexCode++) {
    const remainingChars = wordLength - indexWord
    const remainingSpace = codeLength - indexCode
    if (remainingChars === remainingSpace) {
      return responseCode.concat(word.substring(indexWord))
    } else if (remainingChars === 0) {
      return responseCode.concat(code.substring(indexCode))
    } else {
      if (Math.random() > 0.5) {
        responseCode = responseCode.concat(word[indexWord])
        indexWord++
      } else {
        responseCode = responseCode.concat(code[indexCode])
      }
    }
  }
  return responseCode
}

const createSubsequenceCodes = (
  codeSize,
  numberOfCodes,
  possibleDistractingWords
) => {
  const randomCodes = createRandomCodes(codeSize, numberOfCodes)

  const subsequenceCodes = randomCodes.map((code) => {
    const randomDistractingWord =
      possibleDistractingWords[
        Math.floor(Math.random() * possibleDistractingWords.length)
      ]
    return insertWordIntoCode(randomDistractingWord, code)
  })

  return subsequenceCodes
}

const test = (
  possibleDistractingWords,
  codeSize,
  repeatDictionaryTimes,
  totalNumberOfExistingRandomCodes,
  totalNumberOfTestRandomCodes,
  totalNumberOfSubsequenceCodes
) => {
  console.time('createData')
  console.log('Creating sample data.')
  const repeatedDistractingWords = []
  for (let i = 0; i < repeatDictionaryTimes; i++) {
    repeatedDistractingWords.push(...possibleDistractingWords)
  }
  console.log('Possible distracting words: ', repeatedDistractingWords)

  const existingRandomCodes = createRandomCodes(
    codeSize,
    totalNumberOfExistingRandomCodes
  )

  const testRandomCodes = createRandomCodes(
    codeSize,
    totalNumberOfTestRandomCodes
  )

  const subsequenceCodes = createSubsequenceCodes(
    codeSize,
    totalNumberOfSubsequenceCodes,
    possibleDistractingWords
  )

  // console.log("random codes: ", randomCodes)
  console.log('test random codes: ', testRandomCodes)
  console.log('subsequenceCodes: ', subsequenceCodes)
  console.log('Sample data created.')
  console.timeEnd('createData')

  console.time('createHashTable')
  console.log('Creating hash table')
  const hashTable = createHashTable(existingRandomCodes)
  console.timeEnd('createHashTable')

  console.log('\n\n----Algorithm 0:----\n\n')
  console.log('Start testing with random codes')
  console.time('randomCodes')
  testRandomCodes.forEach((testRandomCode) => {
    const returnValue = codeDoesNotExistAndIsNotDistracting(
      testRandomCode,
      repeatedDistractingWords,
      hashTable
    )
    assert(returnValue, 'Failed on ' + testRandomCode)
  })
  console.timeEnd('randomCodes')

  console.log('All random passed as valid')
  console.log('Will now test codes with distracting words subsequence')

  console.time('subsequenceCodes')
  subsequenceCodes.forEach((subsequenceCode) => {
    const returnValue = codeDoesNotExistAndIsNotDistracting(
      subsequenceCode,
      repeatedDistractingWords,
      hashTable
    )
    assert(!returnValue, 'Failed on ' + subsequenceCode)
  })
  console.timeEnd('subsequenceCodes')

  console.log('All subsequence passed as invalid')
}

const testWithDefaultValues = (possibleDistractingWords) => {
  const CODE_SIZE = 10 // This should be greater or equal than MAXIMUM_DISTRACTING_WORD_SIZE
  const REPEAT_DICTIONARY_TIMES = 1
  const TOTAL_NUMBER_OF_EXISTING_RANDOM_CODES = 1000000
  const TOTAL_NUMBER_OF_TEST_RANDOM_CODES = 1000
  const TOTAL_NUMBER_OF_SUBSEQUENCE_CODES = 1000
  test(
    possibleDistractingWords,
    CODE_SIZE,
    REPEAT_DICTIONARY_TIMES,
    TOTAL_NUMBER_OF_EXISTING_RANDOM_CODES,
    TOTAL_NUMBER_OF_TEST_RANDOM_CODES,
    TOTAL_NUMBER_OF_SUBSEQUENCE_CODES
  )
}

export default testWithDefaultValues
