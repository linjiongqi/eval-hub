import { useState } from 'react'
import { Icon } from '@iconify/react'
import { MetricCard } from './MetricCard'
import { UploadHistory } from './UploadHistory'
import { QuickStats } from './QuickStats'
import { PermissionGuard } from '../../components/shared/PermissionGuard'
import { mockMetrics } from '../../data/mock-data'
import type { Metric } from '../../types'

const API_CODE = `POST /api/v1/scores/upload

{
  "model_id":     "avatariv",
  "benchmark_id": "portrait50",
  "metric_name":  "lip_sync",
  "scores": [
    { "sample_id": 1, "score": 0.87 },
    { "sample_id": 2, "score": 0.92 }
  ]
}

// Response
{
  "status": "success",
  "records_created": 2
}`

export default function ScoresPage() {
  const [metrics, setMetrics]   = useState(mockMetrics)
  const [showAdd, setShowAdd]   = useState(false)
  const [copied, setCopied]     = useState(false)

  function handleToggle(id: string) {
    setMetrics(prev => prev.map(m =>
      m.metric_id === id
        ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
        : m
    ))
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this metric?')) return
    setMetrics(prev => prev.filter(m => m.metric_id !== id))
  }

  function handleCopy() {
    navigator.clipboard.writeText(API_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">Objective Scores</h1>
          <p className="text-sm text-gray-text mt-1">{metrics.length} registered metrics</p>
        </div>
        <PermissionGuard roles={['admin']}>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Add Metric
          </button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: metrics grid + API */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {metrics.map(m => (
              <MetricCard
                key={m.metric_id}
                metric={m}
                onEdit={() => alert(`Edit ${m.name} — mock`)}
                onDelete={() => handleDelete(m.metric_id)}
                onToggleStatus={() => handleToggle(m.metric_id)}
              />
            ))}
          </div>

          {/* API code block */}
          <div className="bg-surface rounded-card shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">API Integration</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-text hover:text-black transition-colors"
              >
                <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
              {API_CODE}
            </pre>
          </div>

          <UploadHistory />
        </div>

        {/* Right: quick stats */}
        <div>
          <QuickStats />
        </div>
      </div>

      {showAdd && (
        <AddMetricModal
          onClose={() => setShowAdd(false)}
          onAdd={m => { setMetrics(prev => [...prev, m]); setShowAdd(false) }}
        />
      )}
    </div>
  )
}

function AddMetricModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: Metric) => void }) {
  const [metricName, setMetricName] = useState('')
  const [name, setName]             = useState('')
  const [description, setDesc]      = useState('')
  const [rangeMin, setMin]          = useState('0')
  const [rangeMax, setMax]          = useState('1')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({
      metric_id:   `m-${Date.now()}`,
      metric_name: metricName.toLowerCase().replace(/\s+/g, '_'),
      name:        name.trim(),
      description: description.trim(),
      range:       { min: Number(rangeMin), max: Number(rangeMax) },
      status:      'active',
      icon:        'mdi:chart-line',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between">
          <h2 className="font-heading font-semibold">Add Metric</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral transition-colors">
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {[
            { label: 'Metric slug', value: metricName, set: setMetricName, placeholder: 'e.g. lip_sync' },
            { label: 'Display name', value: name, set: setName, placeholder: 'e.g. Lip Sync Score' },
            { label: 'Description', value: description, set: setDesc, placeholder: 'What this metric measures' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-gray-700 block mb-1">{f.label}</label>
              <input
                type="text" value={f.value} onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder} required
                className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Range min', value: rangeMin, set: setMin }, { label: 'Range max', value: rangeMax, set: setMax }].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-700 block mb-1">{f.label}</label>
                <input
                  type="number" value={f.value} onChange={e => f.set(e.target.value)} required
                  className="w-full border border-neutral rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-neutral rounded-full py-2 text-sm font-medium hover:bg-neutral transition-all duration-300">Cancel</button>
            <button type="submit" className="flex-1 bg-black text-white rounded-full py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95]">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}
