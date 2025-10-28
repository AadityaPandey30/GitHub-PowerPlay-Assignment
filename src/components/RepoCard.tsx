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
        <article
            className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 w-full max-w-6xl mx-auto transition-transform duration-200 hover:scale-[1.01]"
        >
            {/* Avatar */}
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
                <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-200"
                    loading="lazy"
                />
            </div>

            {/* Repo details */}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-base sm:text-lg text-blue-600 hover:underline break-words"
                    >
                        {repo.full_name}
                    </a>
                    <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
                        {repo.language ?? '—'}
                    </span>
                </div>

                {/* Description (handles long text gracefully) */}
                <p
                    className="text-sm text-gray-700 mt-2 leading-snug text-center md:text-left line-clamp-3 break-words sm:line-clamp-2"
                    title={repo.description ?? 'No description'}
                >
                    {repo.description ?? 'No description available.'}
                </p>

                {/* Footer section */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-gray-500">
                        ⭐ {shortNumber(repo.stargazers_count)}
                    </div>
                    <button
                        onClick={handleBookmark}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium border transition-colors duration-200 ${bookmarked
                                ? 'bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        ★ {bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>
            </div>
        </article>
    )
})