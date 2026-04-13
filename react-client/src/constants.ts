export const BASE_URL: string =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3000';
