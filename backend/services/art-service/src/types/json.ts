export type JsonPrimitive = string | number | boolean | null | Date;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonRecord = Record<string, JsonValue>;

