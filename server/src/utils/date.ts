export const todayISO = () => new Date().toISOString().split('T')[0];

export const ensureDate = (input?: string) => {
  if (!input) return todayISO();
  // basic YYYY-MM-DD validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return todayISO();
  return input;
};
