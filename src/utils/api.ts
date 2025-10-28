import type { SearchResponse } from '../types/github'


export async function searchRepos(query: string): Promise<SearchResponse> {
const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
query,
)}&per_page=30`
const res = await fetch(url)
if (!res.ok) {
throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
}
const data = (await res.json()) as SearchResponse
return data
}