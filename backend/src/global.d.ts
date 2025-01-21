declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      FB_CLIENT_EMAIL: string;
      FB_PRIVATE_KEY: string;
      FB_PROJECT_ID: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
