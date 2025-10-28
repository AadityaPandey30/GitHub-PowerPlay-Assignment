import React, { useCallback } from "react";
import { shortNumber } from "../utils/format";
import type { Repo } from "../types/github";

interface Props {
  repo: Repo;
  bookmarked: boolean;
  onToggleBookmark: (r: Repo) => void;
}

export default React.memo(function RepoCard({
  repo,
  bookmarked,
  onToggleBookmark,
}: Props) {
  const handleBookmark = useCallback(
    () => onToggleBookmark(repo),
    [onToggleBookmark, repo],
  );

  return (
    <article className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-6xl mx-auto transition-all duration-200 hover:shadow-md">
      {/* Avatar */}
      <img
        src={repo.owner.avatar_url}
        alt={repo.owner.login}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-gray-200 flex-shrink-0 mx-auto sm:mx-0"
        loading="lazy"
      />

      {/* Repo details */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        {/* Repo Name */}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-base sm:text-lg text-blue-600 hover:underline break-words text-center sm:text-left"
        >
          {repo.full_name}
        </a>

        {/* Description */}
        <p
          className="text-sm text-gray-700 mt-1 leading-snug text-center sm:text-left line-clamp-3 break-words"
          title={repo.description ?? "No description"}
        >
          {repo.description ?? "No description available."}
        </p>

        {/* Footer Info Row */}
        <div className="mt-3 flex flex-wrap justify-center sm:justify-between items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1">
              <span>⭐</span> {shortNumber(repo.stargazers_count)}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">●</span>
              <span>{repo.language ?? "—"}</span>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md font-medium border transition-colors duration-200 ${
              bookmarked
                ? "bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200"
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            ★ {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>
    </article>
  );
});
