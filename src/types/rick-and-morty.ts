export interface RMInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RMLocationRef {
  name: string;
  url: string;
}

export interface RMCharacter {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: RMLocationRef;
  location: RMLocationRef;
  image: string;
  episode: string[]; // URLs
  url: string;
  created: string; // ISO date
}

export interface RMListResponse {
  info: RMInfo;
  results: RMCharacter[];
}
