/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_TARGET: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TRAINING_BASE_URL: string;
  // add other env variables as needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
