import assert from 'assert'
import codeDoesNotExistAndIsNotDistracting, {
  isSubsequence,
  codeDoesNotExist,
  codeIsNotDistracting,
  checkAndAdd
} from '../../src/ClassCodeValidator.js'

const nullString = null
const undefinedString = undefined
const emptyString = ''

const anyCode = 'RATS42'

const isSubsequenceShouldReturnFalseWhenStr2IsFalsy = () => {
  const string1 = 'aabbcc'

  assert(isSubsequence(string1, nullString) === false)
  assert(isSubsequence(string1, undefinedString) === false)
  assert(isSubsequence(string1, emptyString) === false)
}

const isSubsequenceShouldReturnTrueWhenStr1IsEmptyAndStr2IsNotFalsy = () => {
  const string2 = 'aabbcc'

  assert(isSubsequence(emptyString, string2))
}

const isSubsequenceShouldReturnFalseWhenStr1IsNullOrUndefinedAndStr2IsNotFalsy = () => {
  const string2 = 'aabbcc'

  assert(isSubsequence(nullString, string2) === false)
  assert(isSubsequence(undefinedString, string2) === false)
}

const isSubsequenceShouldReturnFalseWhenStr1IsNotASubsequenceOfStr2 = () => {
  const string1 = 'CRASH'
  const string2 = 'BCT0URN'

  assert(isSubsequence(string1, string2) === false)
}

const isSubsequenceShouldReturnTrueWhenStr1IsASubsequenceOfStr2 = () => {
  const string1 = 'BURN'
  const string2 = 'BCT0URN'

  assert(isSubsequence(string1, string2))
}

const codeDoesNotExistShouldReturnTrueWhenExistingCodesIsEmpty = () => {
  const existingCodes = {}

  assert(codeDoesNotExist(anyCode, existingCodes))
}

const codeDoesNotExistShouldReturnTrueWhenExistingCodesDoesNotContainCode = () => {
  const existingCode = 'RA1TSF'
  const existingCodes = {}
  existingCodes[existingCode] = existingCode
  const differentCode = 'RATS42'

  assert(codeDoesNotExist(differentCode, existingCodes))
}

const codeDoesNotExistShouldReturnFalseWhenExistingCodesContainsCode = () => {
  const existingCode = anyCode
  const existingCodes = {}
  existingCodes[existingCode] = existingCode

  assert(codeDoesNotExist(existingCode, existingCodes) === false)
}

const codeIsNotDistractingShouldReturnTrueWhenDistractingWordsIsEmpty = () => {
  const distractingWords = []

  assert(codeIsNotDistracting(anyCode, distractingWords))
}

const codeIsNotDistractingShouldReturnTrueWhenNoWordsFromDistractingWordsAreSubsequencesOfCode = () => {
  const code = 'RATS42'
  const distractingWords = ['CRASH', 'BURN']

  assert(codeIsNotDistracting(code, distractingWords))
}

const codeIsNotDistractingShouldReturnFalseWhenAWordFromDistractingWordsIsSubsequencesOfCode = () => {
  const code = 'RATS42'
  const distractingWords = ['CRASH', 'RATS', 'BURN']

  assert(codeIsNotDistracting(code, distractingWords) === false)
}

const codeDoesNotExistAndIsNotDistractingShouldReturnTrueOnlyWhenBothConditionsAreTrue = () => {
  const codeThatDoesNotExistAndIsNotADistraction = 'RXTV42'
  const codeThatDoesNotExistButIsADistraction = 'RATSXT'
  const codeThatAlreadyExistsAndIsADistraction = 'RATS42' // This one could be put by hand into the system.
  const codeThatAlreadyExistsAndIsNotADistraction = 'RXTVXT'
  const distractingWords = ['CRASH', 'RATS', 'BURN']

  const existingCodes = {}
  existingCodes[
    codeThatAlreadyExistsAndIsADistraction
  ] = codeThatAlreadyExistsAndIsADistraction
  existingCodes[
    codeThatAlreadyExistsAndIsNotADistraction
  ] = codeThatAlreadyExistsAndIsNotADistraction

  assert(
    codeDoesNotExistAndIsNotDistracting(
      codeThatDoesNotExistAndIsNotADistraction,
      distractingWords,
      existingCodes
    ) === true
  )
  assert(
    codeDoesNotExistAndIsNotDistracting(
      codeThatDoesNotExistButIsADistraction,
      distractingWords,
      existingCodes
    ) === false
  )
  assert(
    codeDoesNotExistAndIsNotDistracting(
      codeThatAlreadyExistsAndIsADistraction,
      distractingWords,
      existingCodes
    ) === false
  )
  assert(
    codeDoesNotExistAndIsNotDistracting(
      codeThatAlreadyExistsAndIsNotADistraction,
      distractingWords,
      existingCodes
    ) === false
  )
}

const codeDoesNotExistAndIsNotDistractingShouldReturnFalseWhenGivenInvalidParameters = () => {
  const notAString = 3
  const anyString = anyCode
  const arrayOfStrings = [anyString]
  const anyObject = {}
  const notAnArray = anyObject
  const notAnObject = undefined

  assert(
    codeDoesNotExistAndIsNotDistracting(
      notAString,
      arrayOfStrings,
      anyObject
    ) === false
  )

  assert(
    codeDoesNotExistAndIsNotDistracting(anyString, notAnArray, anyObject) ===
      false
  )

  assert(
    codeDoesNotExistAndIsNotDistracting(
      anyString,
      arrayOfStrings,
      notAnObject
    ) === false
  )
}

const checkAndAddShouldAddIfItIsValid = () => {
  const distractingWords = ['CRASH', 'RATS', 'BURN']
  const codeThatDoesNotExistAndIsNotADistraction = 'RXTV42'
  const otherValidCode = 'RXTV43'
  const existingCodes = {}

  existingCodes[
    codeThatDoesNotExistAndIsNotADistraction
  ] = codeThatDoesNotExistAndIsNotADistraction

  const response = checkAndAdd(otherValidCode, distractingWords, existingCodes)

  assert(response.valid === true)
  assert(response.existing_codes[otherValidCode] !== undefined)
}

const checkAndAddShouldNotAddIfItIsNotValid = () => {
  const distractingWords = ['CRASH', 'RATS', 'BURN']
  const existingCode = 'RXTV42'
  const otherInvalidCode = 'RATS42'
  const existingCodes = {}

  existingCodes[existingCode] = existingCode

  const response = checkAndAdd(
    otherInvalidCode,
    distractingWords,
    existingCodes
  )

  assert(response.valid === false)
  assert(response.existing_codes[otherInvalidCode] === undefined)
}

const checkAndAddShouldNotAddTheSameValidCodeTwice = () => {
  const distractingWords = ['CRASH', 'RATS', 'BURN']
  const existingCode = 'RXTV42'
  const validCode = 'RXTV43'
  const existingCodes = {}

  existingCodes[existingCode] = existingCode

  const response = checkAndAdd(validCode, distractingWords, existingCodes)

  assert(response.valid === true)
  assert(response.existing_codes[validCode] !== undefined)

  const response2 = checkAndAdd(
    validCode,
    distractingWords,
    response.existing_codes
  )

  assert(response2.valid === false)
}

const testAll = () => {
  isSubsequenceShouldReturnFalseWhenStr2IsFalsy()
  isSubsequenceShouldReturnTrueWhenStr1IsEmptyAndStr2IsNotFalsy()
  isSubsequenceShouldReturnFalseWhenStr1IsNullOrUndefinedAndStr2IsNotFalsy()
  isSubsequenceShouldReturnFalseWhenStr1IsNotASubsequenceOfStr2()
  isSubsequenceShouldReturnTrueWhenStr1IsASubsequenceOfStr2()

  codeDoesNotExistShouldReturnTrueWhenExistingCodesIsEmpty()
  codeDoesNotExistShouldReturnTrueWhenExistingCodesDoesNotContainCode()
  codeDoesNotExistShouldReturnFalseWhenExistingCodesContainsCode()

  codeIsNotDistractingShouldReturnTrueWhenDistractingWordsIsEmpty()
  codeIsNotDistractingShouldReturnTrueWhenNoWordsFromDistractingWordsAreSubsequencesOfCode()
  codeIsNotDistractingShouldReturnFalseWhenAWordFromDistractingWordsIsSubsequencesOfCode()

  codeDoesNotExistAndIsNotDistractingShouldReturnTrueOnlyWhenBothConditionsAreTrue()
  codeDoesNotExistAndIsNotDistractingShouldReturnFalseWhenGivenInvalidParameters()

  checkAndAddShouldAddIfItIsValid()
  checkAndAddShouldNotAddIfItIsNotValid()
  checkAndAddShouldNotAddTheSameValidCodeTwice()
}

export default testAll
