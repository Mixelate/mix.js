export function $falsyThrow<T>(message: string, value: T): NonNullable<T> {
  if (
    value == null ||
    value == undefined ||
    (typeof value == "number" && value == NaN)
  )
    throw message;
  return value!;
}

export function $falsyThrowParseI(message: string, value: string): number {
  const parsed = parseInt(value);

  if (parsed == NaN) throw message;

  return parsed;
}

export function $falsyDefaultParseI(
  value: string,
  defaultValue: number
): number {
  const parsed = parseInt(value);

  if (parsed == NaN) return defaultValue;

  return parsed;
}
