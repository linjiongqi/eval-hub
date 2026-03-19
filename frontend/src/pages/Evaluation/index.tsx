import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { SampleInfoCard } from './SampleInfoCard'
import { VideoCompareArea } from './VideoCompareArea'
import { AnnotationPanel } from './AnnotationPanel'
import { useExperiment } from '../../hooks/useExperiment'
import {
  mockExperiments, mockModelResults, mockBenchmarks, mockVotes,
  mockVoteVideoFeedback, mockHistoricalVotes, CURRENT_USER_ID,
} from '../../data/mock-data'

export default function EvaluationPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const experiment = mockExperiments.find(e => e.experiment_id === id)
  if (!experiment) return <div className="text-gray-text p-8">Experiment not found.</div>

  const bm = mockBenchmarks.find(b => b.benchmark_id === experiment.benchmark_id)
  const samples = bm?.samples ?? []

  const {
    currentIndex, sampleId, currentVote, hasVoted,
    pickModel, setPickReason, setComment, toggleIssueTag,
    getFeedback, submitAndNext, skip, navigate: navSample,
  } = useExperiment(samples.length)

  const currentSample = samples[currentIndex]
  if (!currentSample) return <div className="text-gray-text p-8">No samples found.</div>

  const selectedModelId = currentVote?.winner_model_id ?? null

  const comments: Record<string, string> = {}
  const issueTags: Record<string, any[]> = {}
  experiment.model_ids.forEach(mid => {
    comments[mid] = getFeedback(mid).comment
    issueTags[mid] = getFeedback(mid).issue_tags
  })

  // Historical comments in same experiment (prior evaluation sessions)
  const historicalComments = mockVoteVideoFeedback
    .filter(f => mockVotes.some(v =>
      v.vote_id === f.vote_id &&
      v.experiment_id === experiment.experiment_id &&
      v.sample_id === sampleId
    ))
    .map(f => ({ modelId: f.model_id, comment: f.comment ?? '', date: 'Previous session' }))
    .filter(h => h.comment)

  // Cross-experiment annotations (same evaluator, same benchmark+sample, different experiment)
  const crossExpVotes = mockHistoricalVotes.filter(v =>
    v.evaluator_id === CURRENT_USER_ID &&
    v.experiment_id !== experiment.experiment_id &&
    v.sample_id === sampleId
  )
  const historicalAnnotations = crossExpVotes.map(v => ({
    experimentName: mockExperiments.find(e => e.experiment_id === v.experiment_id)?.name ?? 'Unknown',
    winnerLabel: v.is_tie ? 'Tie' : (
      experiment.model_ids.indexOf(v.winner_model_id ?? '') >= 0
        ? experiment.display_labels[experiment.model_ids.indexOf(v.winner_model_id ?? '')]
        : v.winner_model_id ?? ''
    ),
    pickReason: v.pick_reason,
    feedback: [],
    date: new Date(v.created_at).toLocaleDateString(),
  }))

  const progressPct = Math.round((currentIndex / samples.length) * 100)

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] -m-8">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-neutral bg-surface/80 backdrop-blur-sm sticky top-20 z-30">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => navigate('/experiments')} className="p-2 rounded-xl hover:bg-neutral transition-colors flex-shrink-0">
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-heading font-semibold text-base truncate">{experiment.name}</h1>
            <p className="text-xs text-gray-text">{experiment.benchmark_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm text-gray-text font-medium">{currentIndex + 1} / {samples.length}</span>
          <div className="flex gap-1">
            <button onClick={() => navSample('prev')} disabled={currentIndex === 0}
              className="p-2 rounded-xl hover:bg-neutral disabled:opacity-30 transition-colors">
              <Icon icon="lucide:chevron-left" className="w-4 h-4" />
            </button>
            <button onClick={() => navSample('next')} disabled={currentIndex === samples.length - 1}
              className="p-2 rounded-xl hover:bg-neutral disabled:opacity-30 transition-colors">
              <Icon icon="lucide:chevron-right" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-neutral">
        <div className="h-full bg-indigo transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-8">
        <div className="col-span-2 space-y-4">
          <SampleInfoCard benchmarkId={experiment.benchmark_id} sample={currentSample} />
          <VideoCompareArea
            experiment={experiment}
            sampleId={sampleId}
            results={mockModelResults}
            selectedModelId={selectedModelId}
            onPick={pickModel}
            comments={comments}
            onCommentChange={setComment}
            historicalComments={historicalComments}
          />
        </div>
        <div>
          <AnnotationPanel
            experiment={experiment}
            hasVoted={hasVoted}
            pickReason={currentVote?.pick_reason ?? ''}
            onPickReasonChange={setPickReason}
            issueTags={issueTags}
            onToggleTag={toggleIssueTag}
            historicalAnnotations={historicalAnnotations}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-neutral bg-surface/80 sticky bottom-0">
        <button onClick={skip}
          className="px-6 py-2.5 border border-neutral rounded-full text-sm font-medium hover:bg-neutral transition-all duration-300">
          Skip
        </button>
        <button onClick={submitAndNext} disabled={!hasVoted}
          className="px-8 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.95] disabled:opacity-40">
          Submit & Next
        </button>
      </div>
    </div>
  )
}
