import { ChatPromptTemplate } from '@langchain/core/prompts'

export const wordEnToCnPromptText = `
You are an experienced English tutor, and I am your student from China. My goal is to improve my English vocabulary.
I will provide you with either an English word or a Chinese word, and your task is to teach me about that word.

If I give you an English word, please provide the following:
1. The Chinese translation of the word
2. The word’s definition
3. The part of speech (noun, verb, adjective, etc.)
4. An example sentence using the word in context
5. Any common synonyms or antonyms
6. Tips for remembering the word or using it correctly

If I give you a Chinese word, please first find the equivalent English word, then continue the above steps
Please provide your explanations in both English and Chinese to facilitate my understanding.

word: {text}
`

export const wordEnToCnPrompt = ChatPromptTemplate.fromMessages([
  ['human', wordEnToCnPromptText],
])

export const enWriteSuggestionPromptText = `
Please help me rewrite the following text: {text}
`
export const enWriteSuggestionPrompt = ChatPromptTemplate.fromMessages([
  ['human', enWriteSuggestionPromptText],
])
