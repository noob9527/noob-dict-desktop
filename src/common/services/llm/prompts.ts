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

export const textAreaEnToCnPromptText = `
You are an experienced English tutor, and I am your student from China.
Please translate the following text from English to Chinese.

text:
{text}
`

// https://github.com/f/awesome-chatgpt-prompts?tab=readme-ov-file#act-as-an-english-translator-and-improver
export const textAreaToEnPromptText = `
I want you to act as an English translator, spelling corrector and improver. 
I will speak to you in any language and you will detect the language, 
translate it and answer in the corrected and improved version of my text, in English. 
I want you to replace my simplified A0-level words and sentences with more beautiful 
and elegant, upper level English words and sentences. 
Keep the meaning same, but make them more literary. 
I want you to only reply the correction, the improvements and nothing else, do not write explanations. 
I: {text}
`

export const textAreaToEnPrompt = ChatPromptTemplate.fromMessages([
  ['human', textAreaToEnPromptText],
])

export const textAreaEnToCnPrompt = ChatPromptTemplate.fromMessages([
  ['human', textAreaEnToCnPromptText],
])

export const enWriteSuggestionPromptText = `
You are an experienced English tutor. I just wrote some text in English, 
I need your help to review it for typos and grammatical mistakes.

Please follow these steps:
1. Show me the improvements you made, and provide your explanation, so that I can learn from it.
2. Show me the full revised version, so I can use it directly.

Note that:
1. Please make corrections or improvements only when necessary.
2. Please do not change the original tone.

Here is my writing: 
"""
{text}
"""
`
export const enWriteSuggestionPrompt = ChatPromptTemplate.fromMessages([
  ['human', enWriteSuggestionPromptText],
])
