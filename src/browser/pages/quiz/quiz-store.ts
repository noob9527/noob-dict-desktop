import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../electron-shared/runtime'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../../zustand/create-selectors'

interface QuizState {
  count: number
}

const initialState: QuizState = {
  count: 0,
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
}
