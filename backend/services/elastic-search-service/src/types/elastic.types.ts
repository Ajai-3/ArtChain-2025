export interface ElasticHit<T> {
  _index: string;
  _id?: string;
  _score?: number | null;
  _source?: T;
}

export interface ElasticSearchResponse<T> {
  hits: {
    total: { value: number; relation: string };
    hits: ElasticHit<T>[];
  };
}

export interface SearchParams {
  index: string;
  size?: number;
  sort?: Record<string, string>[];
  query?: Record<string, unknown>;
}