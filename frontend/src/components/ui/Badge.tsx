type Variant = 'indigo' | 'emerald' | 'orange' | 'gray' | 'black' | 'red'

const styles: Record<Variant, string> = {
  indigo:  'bg-indigo-50 text-indigo',
  emerald: 'bg-emerald-50 text-emerald',
  orange:  'bg-orange-50 text-orange',
  gray:    'bg-neutral text-gray-text',
  black:   'bg-black text-white',
  red:     'bg-red-50 text-red-500',
}

interface Props {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'gray', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
