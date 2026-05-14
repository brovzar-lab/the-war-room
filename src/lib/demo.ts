export const isDemoMode =
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === 'REPLACE_WITH_VALUE';

export const demoToast = 'Demo mode — not saved';
