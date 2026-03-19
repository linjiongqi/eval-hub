import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'

interface Props {
  src: string
  label: string
}

export function VideoPlayer({ src, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else          { v.pause(); setPlaying(false) }
  }

  function handleTimeUpdate() {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current
    if (!v || !v.duration) return
    v.currentTime = (Number(e.target.value) / 100) * v.duration
    setProgress(Number(e.target.value))
  }

  return (
    <div className="bg-surface rounded-2xl overflow-hidden shadow-card">
      {/* Label */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
      </div>

      {/* Video */}
      <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
        />
        {/* Play overlay */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          >
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Icon icon="lucide:play" className="w-5 h-5 text-black ml-0.5" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-2.5 flex items-center gap-3">
        <button onClick={togglePlay} className="flex-shrink-0 text-gray-700 hover:text-black transition-colors">
          <Icon icon={playing ? 'lucide:pause' : 'lucide:play'} className="w-4 h-4" />
        </button>
        <input
          type="range" min={0} max={100} value={progress}
          onChange={handleSeek}
          className="flex-1 h-1 accent-indigo cursor-pointer"
        />
      </div>
    </div>
  )
}
