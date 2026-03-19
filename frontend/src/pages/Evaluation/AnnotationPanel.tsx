import { Icon } from '@iconify/react'
import { IssueTagSelector } from '../../components/shared/IssueTagSelector'
import { PICK_REASON_TAGS } from '../../types'
import type { Experiment, IssueTag, VoteVideoFeedback } from '../../types'

interface HistoricalAnnotation {
  experimentName: string
  winnerLabel: string
  pickReason?: string
  feedback: VoteVideoFeedback[]
  date: string
}

interface Props {
  experiment: Experiment
  hasVoted: boolean
  pickReason: string
  onPickReasonChange: (r: string) => void
  issueTags: Record<string, IssueTag[]>
  onToggleTag: (modelId: string, tag: IssueTag) => void
  historicalAnnotations: HistoricalAnnotation[]
  [key: string]: unknown
}

export function AnnotationPanel({
  experiment, hasVoted, pickReason, onPickReasonChange,
  issueTags, onToggleTag, historicalAnnotations,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Pick Reason */}
      <div className="bg-surface rounded-card shadow-card p-5">
        <h3 className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-3">
          Pick Reason
        </h3>
        <textarea
          value={pickReason}
          onChange={e => onPickReasonChange(e.target.value)}
          disabled={!hasVoted}
          placeholder={hasVoted ? 'Why did you pick this one?' : 'Pick a video first…'}
          rows={3}
          className="w-full text-sm border border-neutral rounded-xl px-3 py-2 outline-none focus:border-gray-400 resize-none transition-colors disabled:bg-neutral disabled:text-gray-text"
        />
        {/* Quick tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PICK_REASON_TAGS.map(tag => (
            <button
              key={tag}
              disabled={!hasVoted}
              onClick={() => onPickReasonChange(pickReason ? `${pickReason}, ${tag}` : tag)}
              className="text-xs px-2.5 py-1 rounded-full border border-neutral text-gray-text hover:border-indigo hover:text-indigo disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Issue Tags per video */}
      <div className="bg-surface rounded-card shadow-card p-5">
        <h3 className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-4">
          Issue Tags
        </h3>
        <div className="space-y-4">
          {experiment.model_ids.map((modelId, i) => (
            <div key={modelId}>
              <p className="text-xs font-medium text-gray-700 mb-2">
                {experiment.display_labels[i]} Issues
              </p>
              <IssueTagSelector
                value={issueTags[modelId] ?? []}
                onChange={tag => onToggleTag(modelId, tag)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Historical Annotations */}
      {historicalAnnotations.length > 0 && (
        <details className="bg-surface rounded-card shadow-card p-5 group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <h3 className="text-xs font-semibold text-gray-text uppercase tracking-wider">
              Prior Annotations ({historicalAnnotations.length})
            </h3>
            <Icon icon="lucide:chevron-down" className="w-4 h-4 text-gray-text group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-4 space-y-3">
            {historicalAnnotations.map((ann, i) => (
              <div key={i} className="border border-neutral rounded-xl p-3 text-xs space-y-1">
                <p className="font-medium text-gray-700">{ann.experimentName}</p>
                <p className="text-gray-text">{ann.date} · Winner: <span className="font-medium text-gray-700">{ann.winnerLabel}</span></p>
                {ann.pickReason && <p className="text-gray-700 italic">"{ann.pickReason}"</p>}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
