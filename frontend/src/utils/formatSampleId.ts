export function formatSampleId(benchmarkId: string, sampleId: number): string {
  return `${benchmarkId}_${String(sampleId).padStart(3, '0')}`
}
