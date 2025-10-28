

export default function Header() {
    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4 justify-between">
                <h1 className="text-lg md:text-xl font-semibold text-left">GitHub Bookmarker</h1>
                <p className="text-xs md:text-sm text-gray-500">Search & bookmark repos — tiny micro-app</p>
            </div>
        </header>
    )
}