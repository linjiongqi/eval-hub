import { Icon } from '@iconify/react'
import { VideoPlayer } from '../../components/ui/VideoPlayer'
import type { Experiment, ModelResult } from '../../types'

interface Props {
  experiment: Experiment
  sampleId: number
  results: ModelResult[]
  selectedModelId: string | null
  onPick: (modelId: string) => void
  comments: Record<string, string>
  onCommentChange: (modelId: string, comment: string) => void
  historicalComments: Array<{ modelId: string; comment: string; date: string }>
}

export function VideoCompareArea({
  experiment, sampleId, results, selectedModelId,
  onPick, comments, onCommentChange, historicalComments,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {experiment.model_ids.map((modelId, i) => {
        const label   = experiment.display_labels[i]
        const result  = results.find(r => r.model_id === modelId && r.sample_id === sampleId)
        const comment = comments[modelId] ?? ''
        const isPicked = selectedModelId === modelId
        const histComments = historicalComments.filter(h => h.modelId === modelId)

        return (
          <div key={modelId} className="space-y-3">
            {/* Video */}
            {result ? (
              <VideoPlayer src={result.video_path} label={label} />
            ) : (
              <div className="bg-neutral rounded-2xl flex items-center justify-center text-gray-text text-sm" style={{ aspectRatio: '16/9' }}>
                No video uploaded
              </div>
            )}

            {/* Pick button */}
            <button
              onClick={() => onPick(modelId)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-300 active:scale-[0.95] ${
                isPicked
                  ? 'bg-indigo text-white'
                  : 'border border-neutral hover:border-indigo hover:text-indigo'
              }`}
            >
              {isPicked && <Icon icon="lucide:check" className="w-4 h-4" />}
              {isPicked ? 'Picked as Best' : 'Pick as Best'}
            </button>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={e => onCommentChange(modelId, e.target.value)}
              placeholder={`Feedback for ${label}…`}
              rows={2}
              className="w-full text-sm border border-neutral rounded-xl px-3 py-2 outline-none focus:border-gray-400 resize-none transition-colors"
            />

            {/* Historical comments */}
            {histComments.length > 0 && (
              <div className="space-y-2">
                {histComments.map((h, j) => (
                  <div key={j} className="bg-neutral rounded-xl px-3 py-2.5">
                    <p className="text-xs text-gray-700">{h.comment}</p>
                    <p className="text-[11px] text-gray-text mt-1">{h.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
