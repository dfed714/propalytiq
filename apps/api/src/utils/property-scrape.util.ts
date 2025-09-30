/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
const coerceNum = (v: unknown): number | null => {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const m = v.replace(/[, ]+/g, '').match(/-?\d+(\.\d+)?/);
    if (m) {
      const n = Number(m[0]);
      return Number.isFinite(n) ? n : null;
    }
  }
  return null;
};

const safeParseJson = (s: string): any | null => {
  try {
    return JSON.parse(s);
  } catch {
    // fallback: extract first {...} block
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(s.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

export { coerceNum, safeParseJson };
