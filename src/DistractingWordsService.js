// - code should be a string
// - distracting_words should be an array of strings
// - existing_codes should be an object that returns undefined for existing_codes[code]
// iff code is a non-existing code
const codeDoesNotExistAndIsNotDistracting = (code, distracting_words, existing_codes) => {
  return codeDoesNotExist(code,existing_codes) && codeIsNotDistracting(code,distracting_words)
}

const codeDoesNotExist = (code, existing_codes) => {
  return existing_codes[code]==undefined
}

const codeIsNotDistracting = (code, distracting_words) => {
  return distracting_words.every(distractingWord => !isSubsequence(distractingWord,code));
}

const isSubsequence = (str1, str2) => {
  // Corner cases
  if(!str2) return false
  if(str1===undefined || str1===null) return false
  if(str1==='') return true

  // Main loop
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

export default { codeDoesNotExistAndIsNotDistracting }