import { Icon } from '@iconify/react'
import { formatSampleId } from '../../utils/formatSampleId'
import type { Benchmark } from '../../types'

interface Props {
  benchmark: Benchmark
  onClose: () => void
}

export function BenchmarkDetail({ benchmark, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-[480px] bg-surface shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-heading font-semibold">{benchmark.name}</h2>
            <p className="text-xs text-gray-text mt-0.5">{benchmark.version} · {benchmark.sample_count} samples</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral transition-colors"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        {/* Sample list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral">
          {benchmark.samples.map(sample => (
            <div key={sample.sample_id} className="px-6 py-4">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral flex-shrink-0">
                  <img src={sample.ref_image} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* ID */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-medium text-indigo">
                      {formatSampleId(benchmark.benchmark_id, sample.sample_id)}
                    </span>
                    {sample.ref_video && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                        <Icon icon="lucide:video" className="w-3 h-3" />
                        video
                      </span>
                    )}
                  </div>

                  {/* Prompt */}
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                    {sample.text_prompt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Bulk Download */}
        <div className="px-6 py-4 border-t border-neutral flex-shrink-0">
          <button
            onClick={() => alert('Download started — mock')}
            className="w-full flex items-center justify-center gap-2 border border-neutral rounded-full py-2.5 text-sm font-medium hover:bg-neutral transition-all duration-300 active:scale-[0.95]"
          >
            <Icon icon="lucide:download" className="w-4 h-4" />
            Bulk Download (.zip)
          </button>
        </div>
      </div>
    </div>
  )
}
