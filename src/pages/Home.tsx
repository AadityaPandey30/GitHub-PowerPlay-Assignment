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

  /**
   * Fetch logic:
   * - If showBookmarkedOnly && no query: fetch bookmarked repos by id (one-time fetch)
   * - If query: run search
   * - If no query and not showing bookmarked: clear results
   *
   * NOTE: we intentionally DO NOT include `bookmarked` in the dependency array.
   * This prevents a cascade of refetches when a bookmark is toggled. Instead,
   * we update `repos` immediately inside the toggle handler to reflect changes.
   */
  useEffect(() => {
    let mounted = true

    // CASE: show bookmarked only AND no query -> fetch bookmarked repo details (one-time)
    if (showBookmarkedOnly && !debouncedQuery.trim()) {
      if (bookmarked.length === 0) {
        setRepos([])
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      // fetch each bookmarked repo by id (lightweight single-repo endpoint)
      Promise.all(
        bookmarked.map((id) =>
          fetch(`https://api.github.com/repositories/${id}`).then(async (res) => {
            const json = await res.json()
            if (!res.ok) {
              // GitHub returns { message: 'Not Found', ... } for missing; we return null so it can be filtered out
              return null
            }
            return json as Repo
          })
        )
      )
        .then((results) => {
          if (!mounted) return
          const valid = results.filter((r): r is Repo => Boolean(r))
          setRepos(valid)
        })
        .catch((err) => {
          if (!mounted) return
          setError(err?.message ?? 'Failed to load bookmarked repos')
          setRepos([])
        })
        .finally(() => mounted && setLoading(false))

      return () => {
        mounted = false
      }
    }

    // CASE: no query and not showing bookmarked -> clear
    if (!debouncedQuery.trim()) {
      setRepos([])
      setError(null)
      setLoading(false)
      return
    }

    // CASE: normal search flow
    setLoading(true)
    setError(null)

    searchRepos(debouncedQuery)
      .then((r) => {
        if (!mounted) return
        setRepos(r.items ?? [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message ?? 'Unknown error')
        setRepos([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
    // intentional deps: do NOT include `bookmarked` here to avoid re-fetch loops
  }, [debouncedQuery, showBookmarkedOnly, /* bookmarked intentionally omitted */])

  /**
   * Toggle bookmark handler:
   * - Update localStorage-backed bookmarked list
   * - If currently viewing bookmarked-only results, update `repos` locally to reflect
   *   the addition/removal immediately without triggering a bulk refetch.
   *
   * Note: `r` is the full repo object provided by the card, so we can add it directly.
   */
  const onToggleBookmark = useCallback(
    (r: Repo) => {
      setBookmarked((prev) => {
        const set = new Set(prev)
        if (set.has(r.id)) {
          set.delete(r.id)
        } else {
          set.add(r.id)
        }
        return Array.from(set)
      })

      // Update the displayed repos locally to avoid a refetch:
      // - if showBookmarkedOnly: removing -> remove from `repos`
      //                       adding    -> prepend the repo (we already have details)
      if (showBookmarkedOnly) {
        setRepos((prev) => {
          const exists = prev.some((p) => p.id === r.id)
          if (exists) {
            // removed case: filter out
            return prev.filter((p) => p.id !== r.id)
          }
          // added case: add repo to top of list for instant feedback
          return [r, ...prev]
        })
      }
    },
    [setBookmarked, showBookmarkedOnly]
  )

  const visibleRepos = useMemo(() => {
    if (showBookmarkedOnly) {
      // When in bookmarked-only mode we already fetched or updated `repos` to contain only bookmarked items,
      // but keep this defensive filter to ensure consistency (no-op in most cases).
      return repos.filter((r) => bookmarkedSet.has(r.id))
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
            <Toggle checked={showBookmarkedOnly} onChange={setShowBookmarkedOnly} label="All Bookmarked Only" />
          </div>
        </div>

        <section className="py-6">
          {loading && (
            <div className="text-center text-gray-500 mx-auto w-fit pt-8">
              <FadeLoader />
            </div>
          )}
          {error && <div className="text-center text-red-500">Error: {error}</div>}
          {!loading && !error && (
            <RepoList repos={visibleRepos} bookmarkedIds={bookmarkedSet} onToggleBookmark={onToggleBookmark} />
          )}
        </section>
      </main>

      <footer className="py-6 px-3 text-center text-sm text-gray-500">
        Built by <a className='underline' target='_blank' href='https://www.linkedin.com/in/aaditya-pandey-ab2829257'>Aaditya</a> • Uses GitHub public search API (30 results)
      </footer>
    </div>
  )
}
