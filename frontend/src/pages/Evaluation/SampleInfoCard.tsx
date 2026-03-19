import { Icon } from '@iconify/react'
import { formatSampleId } from '../../utils/formatSampleId'
import type { Sample } from '../../types'

interface Props {
  benchmarkId: string
  sample: Sample
}

export function SampleInfoCard({ benchmarkId, sample }: Props) {
  return (
    <div className="bg-surface rounded-card shadow-card p-5">
      <div className="flex items-start gap-4">
        {/* Ref image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral flex-shrink-0">
          <img src={sample.ref_image} alt="Reference" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-sm font-semibold text-indigo">
              {formatSampleId(benchmarkId, sample.sample_id)}
            </span>
            {sample.ref_video && (
              <span className="flex items-center gap-1 text-[10px] text-emerald bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                <Icon icon="lucide:video" className="w-3 h-3" />
                ref video
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{sample.text_prompt}</p>
        </div>
      </div>
    </div>
  )
}
