import { useState } from 'react'
import { Icon } from '@iconify/react'
import { MiniBarChart } from '../../components/ui/MiniBarChart'
import { RadarChart } from '../../components/ui/RadarChart'
import { Badge } from '../../components/ui/Badge'
import { ISSUE_TAG_LABELS } from '../../types'
import { formatSampleId } from '../../utils/formatSampleId'
import {
  mockVotes, mockVoteVideoFeedback, mockObjectiveScores,
  mockUsers, mockModelResults,
} from '../../data/mock-data'
import type { Experiment, IssueTag } from '../../types'

const METRICS = [
  { key: 'lip_sync',              label: 'Lip Sync',    color: '#6366F1' },
  { key: 'clarity',               label: 'Clarity',     color: '#10B981' },
  { key: 'naturalness',           label: 'Naturalness', color: '#FB923C' },
  { key: 'motion_quality',        label: 'Motion',      color: '#3B82F6' },
  { key: 'identity_preservation', label: 'Identity',    color: '#8B5CF6' },
]

interface Props { experiment: Experiment }

export function SampleDetailTable({ experiment }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const votes = mockVotes.filter(v => v.experiment_id === experiment.experiment_id)

  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral">
        <h2 className="text-sm font-semibold">Per-Sample Details</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral bg-neutral/50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-text">Sample</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Winner</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Voter</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-text">Reason</th>
            {METRICS.map(m => (
              <th key={m.key} className="text-center px-2 py-3 text-xs font-semibold text-gray-text">{m.label}</th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral">
          {votes.map(vote => {
            const voter  = mockUsers.find(u => u.user_id === vote.evaluator_id)
            const winnerIdx = experiment.model_ids.indexOf(vote.winner_model_id ?? '')
            const winnerName = vote.is_tie ? 'Tie' : vote.is_skipped ? 'Skipped' :
              winnerIdx >= 0 ? experiment.model_names[winnerIdx] : '—'
            const isExp = expanded === vote.vote_id

            // Objective scores for this sample
            const scores = METRICS.map(m => ({
              ...m,
              values: experiment.model_ids.map(mid =>
                mockObjectiveScores.find(s =>
                  s.model_id === mid &&
                  s.benchmark_id === experiment.benchmark_id &&
                  s.metric_name === m.key &&
                  s.sample_id === vote.sample_id
                )?.score ?? 0
              ),
            }))

            const radarData = scores.map(s => ({
              metric: s.label,
              modelA: s.values[0],
              modelB: s.values[1],
            }))

            const feedback = mockVoteVideoFeedback.filter(f => f.vote_id === vote.vote_id)

            return (
              <>
                <tr
                  key={vote.vote_id}
                  className="hover:bg-neutral/30 cursor-pointer transition-colors"
                  onClick={() => setExpanded(isExp ? null : vote.vote_id)}
                >
                  <td className="px-6 py-3 font-mono text-xs text-indigo font-medium">
                    {formatSampleId(experiment.benchmark_id, vote.sample_id)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={vote.is_tie || vote.is_skipped ? 'gray' : 'indigo'}>
                      {winnerName}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-text">{voter?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-text max-w-[160px]">
                    <span className="truncate block">{vote.pick_reason?.slice(0, 60) ?? '—'}</span>
                  </td>
                  {scores.map(s => (
                    <td key={s.key} className="px-2 py-3">
                      <MiniBarChart value={s.values[0]} color={s.color} />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Icon
                      icon={isExp ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                      className="w-4 h-4 text-gray-text"
                    />
                  </td>
                </tr>

                {/* Expanded row */}
                {isExp && (
                  <tr key={`${vote.vote_id}-expanded`}>
                    <td colSpan={4 + METRICS.length + 1} className="px-6 py-5 bg-neutral/20">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Video thumbnails */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-text uppercase tracking-wider">Videos</p>
                          <div className="flex gap-3">
                            {experiment.model_ids.map((mid, i) => {
                              const result = mockModelResults.find(r =>
                                r.model_id === mid && r.sample_id === vote.sample_id
                              )
                              return (
                                <div key={mid} className="space-y-1">
                                  <div className="w-24 h-14 bg-gray-900 rounded-lg overflow-hidden">
                                    {result && (
                                      <video src={result.video_path} className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-text text-center">{experiment.display_labels[i]}</p>
                                </div>
                              )
                            })}
                          </div>
                          {/* Full comment */}
                          {vote.pick_reason && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-1">Pick Reason</p>
                              <p className="text-xs text-gray-700 italic">"{vote.pick_reason}"</p>
                            </div>
                          )}
                          {/* Issue tags */}
                          {feedback.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {feedback.map(f => (
                                <div key={f.model_id}>
                                  {f.issue_tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {f.issue_tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-orange-50 text-orange px-1.5 py-0.5 rounded-full">
                                          {ISSUE_TAG_LABELS[tag as IssueTag]}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Radar chart */}
                        <div className="col-span-2">
                          <p className="text-xs font-semibold text-gray-text uppercase tracking-wider mb-2">Objective Scores</p>
                          <RadarChart
                            data={radarData}
                            labelA={experiment.model_names[0]}
                            labelB={experiment.model_names[1]}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
