import {
  Radar, RadarChart as RechartsRadar, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, Legend,
} from 'recharts'

interface DataPoint {
  metric: string
  modelA: number
  modelB: number
}

interface Props {
  data: DataPoint[]
  labelA: string
  labelB: string
}

export function RadarChart({ data, labelA, labelB }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#F3F4F6" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
        <Radar name={labelA} dataKey="modelA" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} />
        <Radar name={labelB} dataKey="modelB" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
