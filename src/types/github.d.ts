export interface Owner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: Owner;
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repo[];
}
