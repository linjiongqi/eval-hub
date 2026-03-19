import { useState } from 'react'
import { Icon } from '@iconify/react'
import { BenchmarkCard } from './BenchmarkCard'
import { BenchmarkDetail } from './BenchmarkDetail'
import { PermissionGuard } from '../../components/shared/PermissionGuard'
import { useAuth } from '../../hooks/useAuth'
import { mockBenchmarks } from '../../data/mock-data'
import type { Benchmark } from '../../types'

type SortKey = 'name' | 'samples' | 'date'

export default function BenchmarksPage() {
  const { isAdmin } = useAuth()
  const [benchmarks, setBenchmarks] = useState(mockBenchmarks)
  const [selected, setSelected]     = useState<Benchmark | null>(null)
  const [search, setSearch]         = useState('')
  const [version, setVersion]       = useState('')
  const [sort, setSort]             = useState<SortKey>('name')
  const [showCreate, setShowCreate] = useState(false)

  // Unique versions for filter dropdown
  const versions = [...new Set(benchmarks.map(b => b.version))]

  const filtered = benchmarks
    .filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) &&
      (version === '' || b.version === version)
    )
    .sort((a, b) => {
      if (sort === 'name')    return a.name.localeCompare(b.name)
      if (sort === 'samples') return b.sample_count - a.sample_count
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  function handleDelete(id: string) {
    if (!confirm('Delete this benchmark?')) return
    setBenchmarks(prev => prev.filter(b => b.benchmark_id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">Benchmarks</h1>
          <p className="text-sm text-gray-text mt-1">{benchmarks.length} benchmark datasets</p>
        </div>
        <PermissionGuard roles={['admin']}>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Create Benchmark
          </button>
        </PermissionGuard>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-text" />
          <input
            type="text"
            placeholder="Search benchmarks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral rounded-full outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <select
          value={version}
          onChange={e => setVersion(e.target.value)}
          className="text-sm border border-neutral rounded-full px-4 py-2 outline-none bg-white cursor-pointer"
        >
          <option value="">All versions</option>
          {versions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-sm border border-neutral rounded-full px-4 py-2 outline-none bg-white cursor-pointer"
        >
          <option value="name">Sort: Name</option>
          <option value="samples">Sort: Samples</option>
          <option value="date">Sort: Date</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-text text-sm">No benchmarks found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(b => (
            <BenchmarkCard
              key={b.benchmark_id}
              benchmark={b}
              isAdmin={isAdmin}
              onClick={() => setSelected(b)}
              onEdit={() => alert(`Edit ${b.name} — mock`)}
              onDelete={() => handleDelete(b.benchmark_id)}
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <BenchmarkDetail
          benchmark={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateBenchmarkModal
          onClose={() => setShowCreate(false)}
          onCreate={b => { setBenchmarks(prev => [b, ...prev]); setShowCreate(false) }}
        />
      )}
    </div>
  )
}

// ─── Create Benchmark Modal ────────────────────────────────────────────────────
function CreateBenchmarkModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (b: Benchmark) => void
}) {
  const [name, setName]       = useState('')
  const [version, setVersion] = useState('v1.0')
  const [files, setFiles]     = useState<string[]>([])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const names = Array.from(e.target.files ?? []).map(f => f.name)
    setFiles(names)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const newBenchmark: Benchmark = {
      benchmark_id: slug,
      name: name.trim(),
      version,
      sample_count: files.length,
      status: 'current',
      created_at: new Date().toISOString(),
      samples: files.map((_, i) => ({
        sample_id: i + 1,
        text_prompt: `Sample ${i + 1}`,
        ref_image: `https://picsum.photos/seed/${slug}${i}/400/400`,
      })),
    }
    onCreate(newBenchmark)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between">
          <h2 className="font-heading font-semibold">Create Benchmark</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Portrait-50"
              required
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Version</label>
            <input
              type="text"
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="v1.0"
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Upload samples (text + image + video)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral rounded-xl cursor-pointer hover:bg-neutral/50 transition-colors">
              <Icon icon="lucide:upload-cloud" className="w-6 h-6 text-gray-text mb-1" />
              <span className="text-xs text-gray-text">Click to select files</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
            {files.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {files.slice(0, 4).map(f => (
                  <li key={f} className="text-xs text-gray-text truncate">· {f}</li>
                ))}
                {files.length > 4 && <li className="text-xs text-gray-text">…and {files.length - 4} more</li>}
              </ul>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-neutral rounded-full py-2 text-sm font-medium hover:bg-neutral transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white rounded-full py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
