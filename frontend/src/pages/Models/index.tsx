import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Badge } from '../../components/ui/Badge'
import { ModelDetailPanel } from './ModelDetailPanel'
import { UploadResultsModal } from './UploadResultsModal'
import { PermissionGuard } from '../../components/shared/PermissionGuard'
import { useAuth } from '../../hooks/useAuth'
import { mockModels } from '../../data/mock-data'
import type { Model } from '../../types'

const typeBadge: Record<Model['type'], 'indigo' | 'emerald' | 'orange'> = {
  AvatarIV: 'indigo',
  Tokyo:    'emerald',
  Custom:   'orange',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ModelsPage() {
  const { isAdmin } = useAuth()
  const [models, setModels]         = useState(mockModels)
  const [selected, setSelected]     = useState<Model | null>(null)
  const [uploading, setUploading]   = useState<Model | null>(null)
  const [showRegister, setShowRegister] = useState(false)

  function handleDelete(id: string) {
    if (!confirm('Delete this model?')) return
    setModels(prev => prev.filter(m => m.model_id !== id))
    if (selected?.model_id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">Models</h1>
          <p className="text-sm text-gray-text mt-1">{models.length} registered models</p>
        </div>
        <PermissionGuard roles={['admin']}>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Register Model
          </button>
        </PermissionGuard>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral bg-neutral/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-text">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Version</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Benchmarks</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Results</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Updated</th>
              {isAdmin && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {models.map(model => (
              <tr
                key={model.model_id}
                onClick={() => setSelected(model)}
                className="hover:bg-neutral/30 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium">{model.name}</span>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={typeBadge[model.type]}>{model.type}</Badge>
                </td>
                <td className="px-4 py-4 font-mono text-xs text-gray-700">{model.version}</td>
                <td className="px-4 py-4 text-gray-text">{model.benchmarks_tested}</td>
                <td className="px-4 py-4 text-gray-text">{model.results_uploaded}</td>
                <td className="px-4 py-4 text-gray-text text-xs">{formatDate(model.updated_at)}</td>
                {isAdmin && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setUploading(model)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="Upload Results"
                      >
                        <Icon icon="lucide:upload" className="w-3.5 h-3.5 text-indigo" />
                      </button>
                      <button
                        onClick={() => handleDelete(model.model_id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selected && (
        <ModelDetailPanel model={selected} onClose={() => setSelected(null)} />
      )}

      {/* Upload Modal */}
      {uploading && (
        <UploadResultsModal model={uploading} onClose={() => setUploading(null)} />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterModelModal
          onClose={() => setShowRegister(false)}
          onCreate={m => { setModels(prev => [m, ...prev]); setShowRegister(false) }}
        />
      )}
    </div>
  )
}

// ─── Register Model Modal ──────────────────────────────────────────────────────
function RegisterModelModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (m: Model) => void
}) {
  const [name, setName]     = useState('')
  const [type, setType]     = useState<Model['type']>('AvatarIV')
  const [version, setVersion] = useState('v1.0')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newModel: Model = {
      model_id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      type,
      version,
      benchmarks_tested: 0,
      results_uploaded: 0,
      updated_at: new Date().toISOString(),
      version_history: [{ version, uploaded_at: new Date().toISOString(), benchmark_ids: [] }],
    }
    onCreate(newModel)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between">
          <h2 className="font-heading font-semibold">Register Model</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Model Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. AvatarIV" required
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Type</label>
            <select
              value={type} onChange={e => setType(e.target.value as Model['type'])}
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option>AvatarIV</option>
              <option>Tokyo</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Version</label>
            <input
              type="text" value={version} onChange={e => setVersion(e.target.value)}
              placeholder="v1.0"
              className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-neutral rounded-full py-2 text-sm font-medium hover:bg-neutral transition-all duration-300">Cancel</button>
            <button type="submit" className="flex-1 bg-black text-white rounded-full py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}
