import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Runtime } from '../../../electron-shared/runtime'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../../zustand/create-selectors'
import { produce } from 'immer'

interface Nest {
  count: number
  text: string
}

interface AppState {
  count: number
  nest1: Nest
  nest2: Nest | null
}

const initialState: AppState = {
  count: 0,
  nest1: {
    count: 0,
    text: '',
  },
  nest2: null,
}

type AppActions = {
  incCount: () => void
  nest1AppendFoo: () => void
}

const useAppStoreBase = create<AppState & AppActions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      incCount() {
        set(
          produce((state) => {
            state.count++
          }),
        )
      },
      nest1AppendFoo() {
        set(
          produce((state) => {
            state.nest1.text += 'foo'
          }),
        )
      },
    })),
    // (set) => ({
    //   ...initialState,
    //     incCount() {
    //       set(
    //         {
    //           count: 0,
    //         }
    //         // produce((state) => {
    //         //   state.count++
    //         // }),
    //       )
    //     },
    //     nest1AppendFoo() {
    //       set(
    //         produce((state) => {
    //           state.nest1.text += 'foo'
    //         }),
    //       )
    //     },
    // }),
    {
      name: 'app',
      enabled: Runtime.isDev,
    },
  ),
)

export const useAppStore = createSelectors(useAppStoreBase)

export namespace AppActions2 {
  export function decCount() {
    useAppStore.setState((state) => {
      state.count--
    })
  }
  export function nest1AppendBar() {
    useAppStore.setState((state) => {
      state.nest1.text += 'bar'
    })
  }
}
