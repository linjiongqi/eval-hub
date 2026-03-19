import { useState } from 'react'
import { Icon } from '@iconify/react'
import { mockBenchmarks } from '../../data/mock-data'
import type { Model } from '../../types'

const API_SNIPPET = (modelId: string) => `POST /api/v1/models/${modelId}/results
Content-Type: multipart/form-data

{
  "benchmark_id": "portrait50",
  "version": "v2.1",
  "results": [
    { "sample_id": 1, "video": <file> },
    { "sample_id": 2, "video": <file> }
  ]
}

Response:
{
  "status": "success",
  "records_created": 2
}`

interface Props {
  model: Model
  onClose: () => void
}

export function UploadResultsModal({ model, onClose }: Props) {
  const [benchmarkId, setBenchmarkId] = useState('')
  const [files, setFiles]             = useState<string[]>([])
  const [copied, setCopied]           = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(API_SNIPPET(model.model_id))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Mock upload: ${files.length} files for ${model.name} on ${benchmarkId}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-heading font-semibold">Upload Results</h2>
            <p className="text-xs text-gray-text mt-0.5">{model.name} · {model.version}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Web UI upload */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Benchmark</label>
              <select
                value={benchmarkId}
                onChange={e => setBenchmarkId(e.target.value)}
                required
                className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none bg-white"
              >
                <option value="">Select benchmark…</option>
                {mockBenchmarks.map(b => (
                  <option key={b.benchmark_id} value={b.benchmark_id}>{b.name} ({b.version})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Video files</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral rounded-xl cursor-pointer hover:bg-neutral/50 transition-colors">
                <Icon icon="lucide:upload-cloud" className="w-6 h-6 text-gray-text mb-1" />
                <span className="text-xs text-gray-text">Drop video files here or click to browse</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={e => setFiles(Array.from(e.target.files ?? []).map(f => f.name))}
                />
              </label>
              {files.length > 0 && (
                <p className="text-xs text-gray-text mt-1">{files.length} file(s) selected</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
            >
              Upload
            </button>
          </form>

          {/* API snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-text uppercase tracking-wider">API Integration</p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-text hover:text-black transition-colors"
              >
                <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
              {API_SNIPPET(model.model_id)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
