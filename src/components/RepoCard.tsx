import React, { useCallback } from 'react'
import { shortNumber } from '../utils/format'
import type { Repo } from '../types/github'


interface Props {
    repo: Repo
    bookmarked: boolean
    onToggleBookmark: (r: Repo) => void
}


export default React.memo(function RepoCard({ repo, bookmarked, onToggleBookmark }: Props) {
    const handleBookmark = useCallback(() => onToggleBookmark(repo), [onToggleBookmark, repo])


    return (
        <article className="bg-white rounded-lg shadow p-4 flex gap-4 max-w-6xl">
            <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-12 h-12 rounded" />
            <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-semibold">
                        {repo.full_name}
                    </a>
                    <div className="text-sm text-gray-600">{repo.language ?? '—'}</div>
                </div>
                <p className="text-sm text-gray-600 mt-1 text-left line-clamp-2">{repo.description ?? 'No description'}</p>
                <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">⭐ {shortNumber(repo.stargazers_count)}</div>
                    <button
                        onClick={handleBookmark}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border ${bookmarked ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200'
                            }`}
                    >
                        ★ Bookmark
                    </button>
                </div>
            </div>
        </article>
    )
})