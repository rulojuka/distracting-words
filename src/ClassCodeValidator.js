// - code should be a string
// - distracting_words should be an array of strings
// - existing_codes should be an object that returns undefined for existing_codes[code]
// if and only if code is a non-existing code
const codeDoesNotExistAndIsNotDistracting = (
  code,
  distracting_words,
  existing_codes
) => {
  // These invalid cases should throw exceptions
  if (!(typeof code === 'string')) return false
  if (!(distracting_words instanceof Array)) return false
  if (!(existing_codes instanceof Object)) return false

  return (
    codeDoesNotExist(code, existing_codes) &&
    codeIsNotDistracting(code, distracting_words)
  )
}

const checkAndAdd = (code, distracting_words, existing_codes) => {
  const valid = codeDoesNotExistAndIsNotDistracting(
    code,
    distracting_words,
    existing_codes
  )
  let newExistingCodes = {}
  if (valid) {
    newExistingCodes = { ...existing_codes }
    newExistingCodes[code] = code
  }
  return {
    valid,
    existing_codes: newExistingCodes
  }
}

const codeDoesNotExist = (code, existingCodes) => {
  return existingCodes[code] === undefined
}

const codeIsNotDistracting = (code, distractingWords) => {
  return distractingWords.every(
    (distractingWord) => !isSubsequence(distractingWord, code)
  )
}

const isSubsequence = (str1, str2) => {
  // Corner cases
  if (!str2) return false
  if (str1 === undefined || str1 === null) return false
  if (str1 === '') return true

  // Main loop
  let index1 = 0
  for (let index2 = 0; index2 < str2.length; index2++) {
    if (str1[index1] === str2[index2]) {
      index1++
    }
    if (index1 === str1.length) {
      return true
    }
  }
  return false
}

export { isSubsequence, codeDoesNotExist, codeIsNotDistracting, checkAndAdd }
export default codeDoesNotExistAndIsNotDistracting
