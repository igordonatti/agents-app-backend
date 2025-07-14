/**
 * Helper function to convert BigInt values to Number recursively
 * This is needed because JSON.stringify() cannot serialize BigInt values
 */
export function convertBigIntToNumber(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return Number(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertBigIntToNumber(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const converted: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        converted[key] = convertBigIntToNumber(
          (obj as Record<string, unknown>)[key],
        );
      }
    }
    return converted;
  }

  return obj;
}
