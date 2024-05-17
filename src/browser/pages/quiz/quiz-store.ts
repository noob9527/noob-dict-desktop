import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../electron-shared/runtime'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../../zustand/create-selectors'
import { LLMProvider } from '../../../common/services/llm/provider'
import { rendererContainer } from '../../../common/container/renderer-container'
import {
  LocalNoteServiceToken,
  NoteService,
} from '../../../common/services/db/note-service'
import { useRootStore } from '../../root-store'
import { random } from 'lodash'
import { INote } from '../../../common/model/note'
import {
  QuizGenerator,
  QuizGeneratorToken,
  SingleChoiceQuestion,
} from '../../../common/services/llm/quiz-generator'
import { SettingActions, useSettingStore } from '../setting/setting-store'
import { Workflow } from '../../../common/services/llm/workflow'
import { toPromptTemplate } from '../../../common/services/llm/utils'
import logger from '../../../electron-shared/logger'

const noteService = rendererContainer.get<NoteService>(LocalNoteServiceToken)
const quizGenerator = rendererContainer.get<QuizGenerator>(QuizGeneratorToken)

interface QuestionContainer {
  question: SingleChoiceQuestion
  selectedIndex?: number
}

const question = {
  question:
    "Henry's news report covering the conference was so _____ that nothing had been omitted.",
  choices: [
    'understanding',
    'comprehensible',
    'comprehensive',
    'understandable',
  ],
  answer: 'comprehensive',
  explanation:
    'comprehensive 完全的无所不包的; comprehensible 能懂的, 可以理解的; understandable 可以理解的, 主要用来指人的行为。understanding 用来指人时, 表示善于理解别人或别人问题的 (人) 。\n - a comprehensive map (街区详图); \n - a comprehensible remark (听得懂的话),\n - an understandable mistake (可以理解的错误); \n - an understanding friend (一位能理解人的朋友)。',
}

interface QuizState {
  selectedLLMProvider: LLMProvider.Constant | null
  questionContainers: QuestionContainer[]
  currentIndex: number
}

const initialState: QuizState = {
  currentIndex: 0,
  selectedLLMProvider: null,
  questionContainers: [{
    question,
  }],
}

const useQuizStoreBase = create<QuizState>()(
  devtools(
    immer(() => initialState),
    {
      name: 'quiz',
      enabled: Runtime.isDev,
    },
  ),
)

export const useQuizStore = createSelectors(useQuizStoreBase)

export namespace QuizActions {
  import getPrompt = SettingActions.getPrompt
  import getLLMInitOption = SettingActions.getLLMInitOption

  async function getRandomNote(): Promise<INote | null> {
    const user_id = useRootStore.getState().currentUser?.id ?? ''
    const notes = await noteService.fetchLatest(20, user_id)
    if (!notes.length) return null
    return notes[random(notes.length - 1)]
  }

  export async function generateQuestion() {
    const note = await getRandomNote()
    if (!note) return

    const prompt = getPrompt(Workflow.quiz_singular_choice)
    const tpl = toPromptTemplate(prompt)
    const state = useQuizStore.getState()

    const selectedLLMProvider = state.selectedLLMProvider
    if (!selectedLLMProvider) {
      throw new Error('No LLM provider')
    }

    const option = getLLMInitOption(selectedLLMProvider)

    const question = await quizGenerator
      .generateSingularChoice({ text: note.text }, tpl, {
        ...option,
        temperature: 1,
        response_format: 'json',
      })
      .catch((e) => {
        logger.error(e)
        return null
      })
    if (!question) return

    useQuizStore.setState((state) => {
      state.questionContainers = [...state.questionContainers, {
        question,
      }]
    })
  }

  export function previousQuestion() {
    useQuizStore.setState((state) => {
      if (state.currentIndex) {
        state.currentIndex--
      }
    })
  }

  export function nextQuestion() {
    useQuizStore.setState((state) => {
      if (state.currentIndex >= state.questionContainers.length - 2) {
        generateQuestion()
      }
      if (state.currentIndex < state.questionContainers.length - 1) {
        state.currentIndex++
      }
    })
  }
}
