import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import RepoList from '../components/RepoList'
import Toggle from '../components/Toggle'
import { searchRepos } from '../utils/api'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Repo } from '../types/github'
import { FadeLoader } from 'react-spinners'


export default function Home() {
const [query, setQuery] = useState('')
const debouncedQuery = useDebouncedValue(query, 350)


const [repos, setRepos] = useState<Repo[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)


const [bookmarked, setBookmarked] = useLocalStorage<number[]>('bookmarked_repo_ids', [])
const bookmarkedSet = useMemo(() => new Set(bookmarked), [bookmarked])


const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)


useEffect(() => {
if (!debouncedQuery.trim()) {
setRepos([])
setError(null)
setLoading(false)
return
}

let mounted = true
setLoading(true)
setError(null)


searchRepos(debouncedQuery)
.then(r => {
if (!mounted) return
setRepos(r.items ?? [])
})
.catch(err => {
if (!mounted) return
setError(err.message ?? 'Unknown error')
setRepos([])
})
.finally(() => mounted && setLoading(false))


return () => {
mounted = false
}
}, [debouncedQuery])


const onToggleBookmark = useCallback(
(r: Repo) => {
setBookmarked(prev => {
const set = new Set(prev)
if (set.has(r.id)) {
set.delete(r.id)
} else {
set.add(r.id)
}
return Array.from(set)
})
},
[setBookmarked],
)


const visibleRepos = useMemo(() => {
if (showBookmarkedOnly) {
return repos.filter(r => bookmarkedSet.has(r.id))
}
return repos
}, [repos, showBookmarkedOnly, bookmarkedSet])


return (
<div className="min-h-screen flex flex-col">
<Header />
<main className="flex-1">
<SearchBar value={query} onChange={setQuery} />


<div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-4">
<div className="text-sm text-gray-600">Results: {repos.length}</div>
<div className="flex items-center gap-4">
<Toggle checked={showBookmarkedOnly} onChange={setShowBookmarkedOnly} label="Show Bookmarked Only" />
</div>
</div>


<section className="py-6">
{loading && <div className="text-center text-gray-500 mx-auto w-fit"><FadeLoader/></div>}
{error && <div className="text-center text-red-500">Error: {error}</div>}
{!loading && !error && <RepoList repos={visibleRepos} bookmarkedIds={bookmarkedSet} onToggleBookmark={onToggleBookmark} />}
</section>
</main>


<footer className="py-6 text-center text-sm text-gray-500">
Built with ❤️ • Uses GitHub public search API (30 results)
</footer>
</div>
)
}