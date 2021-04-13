import fetch from 'node-fetch'

const fetchDictionary = async (URL) => {
  let dictionary
  await fetch(URL)
    .then((res) => res.text())
    .then((text) => {
      dictionary = text.split('\n')
    })
    .catch((error) => console.error('Could not fetch dictionary' + error))
  return dictionary
}

const dictionaryToUpperCase = (dictionary) => {
  return dictionary.map((word) => word.toUpperCase())
}

const getDictionary = async (URL) => {
  const fetchedDictionary = await fetchDictionary(URL)
  const candidateDistractingWords = dictionaryToUpperCase(fetchedDictionary)

  const MAXIMUM_DISTRACTING_WORD_SIZE = 6 // This should be lower or equal than CODE_SIZE
  const MINIMUM_DISTRACTING_WORD_SIZE = 4
  return candidateDistractingWords.filter(
    (word) =>
      word.length <= MAXIMUM_DISTRACTING_WORD_SIZE &&
      word.length >= MINIMUM_DISTRACTING_WORD_SIZE
  )
}

export default getDictionary
