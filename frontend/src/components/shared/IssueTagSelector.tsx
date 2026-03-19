import { ISSUE_TAG_LABELS } from '../../types'
import type { IssueTag } from '../../types'

interface Props {
  value: IssueTag[]
  onChange: (tag: IssueTag) => void
}

export function IssueTagSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(ISSUE_TAG_LABELS) as IssueTag[]).map(tag => {
        const active = value.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all duration-200 ${
              active
                ? 'bg-orange border-orange text-white'
                : 'bg-white border-neutral text-gray-text hover:border-orange hover:text-orange'
            }`}
          >
            {ISSUE_TAG_LABELS[tag]}
          </button>
        )
      })}
    </div>
  )
}
