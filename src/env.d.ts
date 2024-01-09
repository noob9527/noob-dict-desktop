/// <reference types="vite/client" />
// see https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
