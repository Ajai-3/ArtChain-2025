import type { JsonRecord } from './json';


export type MongoQuery = JsonRecord;
export type MongoSort = JsonRecord;

export type MongoLeanId = string | { toString(): string };

