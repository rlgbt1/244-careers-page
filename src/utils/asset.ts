const BASE = import.meta.env.BASE_URL
export const asset = (path: string) => `${BASE}${path.replace(/^\//, '')}`
