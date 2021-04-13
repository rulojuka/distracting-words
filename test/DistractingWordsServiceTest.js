import assert from "assert"
import { isSubsequence } from '../src/DistractingWordsService.js'

function testIsSubsequence(){
  const string1 = "aabbcc"
  const subsequence1 = "ac"
  const emptyString = ""
  const notSubsequence1 = "abcd"
  const notSubsequence2 = "aaa"
  const notSubsequence3 = "d"
  const nullString = null
  const undefinedString = undefined

  assert(isSubsequence(subsequence1,string1))
  assert(isSubsequence(emptyString,string1))
  assert(isSubsequence(notSubsequence1,string1) === false)
  assert(isSubsequence(notSubsequence2,string1) === false)
  assert(isSubsequence(notSubsequence3,string1) === false)
  assert(isSubsequence(nullString,string1) === false)
  assert(isSubsequence(undefinedString,string1) === false)

  assert(isSubsequence(notSubsequence1,nullString) === false)
  assert(isSubsequence(notSubsequence1,undefinedString) === false)
  assert(isSubsequence(notSubsequence1,emptyString) === false)
}

export default testIsSubsequence