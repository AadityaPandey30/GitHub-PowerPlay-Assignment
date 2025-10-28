import React from 'react'
import type { Repo } from '../types/github'
import RepoCard from './RepoCard'


interface Props {
    repos: Repo[]
    bookmarkedIds: Set<number>
    onToggleBookmark: (r: Repo) => void
}


export default React.memo(function RepoList({ repos, bookmarkedIds, onToggleBookmark }: Props) {
    if (repos.length === 0) {
        return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">No results</div>
    }


    return (
        <div className="max-w-4xl mx-auto px-4 grid gap-4">
            {repos.map(r => (
                <RepoCard key={r.id} repo={r} bookmarked={bookmarkedIds.has(r.id)} onToggleBookmark={onToggleBookmark} />
            ))}
        </div>
    )
})