import { useState, useCallback } from 'react'
import type { IssueTag } from '../types'

interface VoteState {
  winner_model_id: string | null
  is_tie: boolean
  is_skipped: boolean
  pick_reason: string
}

interface FeedbackState {
  comment: string
  issue_tags: IssueTag[]
}

export function useExperiment(totalSamples: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [votes, setVotes]               = useState<Record<number, VoteState>>({})
  const [feedback, setFeedback]         = useState<Record<string, FeedbackState>>({}) // key: `${sampleId}-${modelId}`

  const sampleId = currentIndex + 1  // 1-based

  const currentVote   = votes[sampleId]
  const hasVoted      = !!currentVote && !currentVote.is_skipped

  function pickModel(modelId: string) {
    setVotes(prev => ({
      ...prev,
      [sampleId]: { winner_model_id: modelId, is_tie: false, is_skipped: false, pick_reason: prev[sampleId]?.pick_reason ?? '' },
    }))
  }

  function setPickReason(reason: string) {
    setVotes(prev => ({
      ...prev,
      [sampleId]: { ...(prev[sampleId] ?? { winner_model_id: null, is_tie: false, is_skipped: false }), pick_reason: reason },
    }))
  }

  function setComment(modelId: string, comment: string) {
    const key = `${sampleId}-${modelId}`
    setFeedback(prev => ({ ...prev, [key]: { ...(prev[key] ?? { issue_tags: [] }), comment } }))
  }

  function toggleIssueTag(modelId: string, tag: IssueTag) {
    const key = `${sampleId}-${modelId}`
    setFeedback(prev => {
      const current = prev[key] ?? { comment: '', issue_tags: [] }
      const tags = current.issue_tags.includes(tag)
        ? current.issue_tags.filter(t => t !== tag)
        : [...current.issue_tags, tag]
      return { ...prev, [key]: { ...current, issue_tags: tags } }
    })
  }

  function getFeedback(modelId: string): FeedbackState {
    return feedback[`${sampleId}-${modelId}`] ?? { comment: '', issue_tags: [] }
  }

  const submitAndNext = useCallback(() => {
    if (currentIndex < totalSamples - 1) setCurrentIndex(i => i + 1)
  }, [currentIndex, totalSamples])

  const skip = useCallback(() => {
    setVotes(prev => ({
      ...prev,
      [sampleId]: { winner_model_id: null, is_tie: false, is_skipped: true, pick_reason: '' },
    }))
    if (currentIndex < totalSamples - 1) setCurrentIndex(i => i + 1)
  }, [currentIndex, sampleId, totalSamples])

  const navigate = useCallback((dir: 'prev' | 'next') => {
    setCurrentIndex(i => dir === 'prev' ? Math.max(0, i - 1) : Math.min(totalSamples - 1, i + 1))
  }, [totalSamples])

  return {
    currentIndex,
    sampleId,
    currentVote,
    hasVoted,
    pickModel,
    setPickReason,
    setComment,
    toggleIssueTag,
    getFeedback,
    submitAndNext,
    skip,
    navigate,
  }
}
