'use client'

import { useEffect, useState } from 'react'
import MultiCard from './MultiCard'
import type { Database } from '@/lib/database.types'

type Multi = Database['public']['Tables']['multis']['Row']

const allGames = [
  '컴페티치오네',
  '아세토코르사',
  '그란투리스모7',
  '르망얼티밋',
  '아이레이싱',
  '알펙터2',
]

export default function MultiListPage({
  currentUserId,
  simplified = false,
}: {
  currentUserId: string | null
  simplified?: boolean
}) {
  const [multis, setMultis] = useState<Multi[]>([])
  const [selectedGames, setSelectedGames] = useState<string[]>(allGames)
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest')

  useEffect(() => {
    const fetchMultis = async () => {
      const res = await fetch('/api/multis')
      const data: Multi[] = await res.json()
      setMultis(data)
    }

    fetchMultis()
  }, [])

  const toggleGameSelection = (game: string) => {
    setSelectedGames(prev =>
      prev.includes(game)
        ? prev.filter(g => g !== game)
        : [...prev, game]
    )
  }

  const filtered = multis
    .filter(multi => selectedGames.includes(multi.game))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB
    })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 🔍 게임 필터 체크박스 */}
      <div className="mb-6 border p-4 rounded bg-white shadow-sm">
        <h2 className="font-semibold mb-2">🎮 게임 필터</h2>
        <div className="flex flex-wrap gap-3">
          {allGames.map(game => (
            <label key={game} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectedGames.includes(game)}
                onChange={() => toggleGameSelection(game)}
              />
              <span>{game}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="mb-4 flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
          className="border p-2 rounded"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {/* 📃 공지 리스트 */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">선택한 게임에 해당하는 공지가 없습니다.</p>
      ) : (
        filtered.map(multi => (
          <MultiCard key={multi.id} multi={multi} currentUserId={currentUserId} />
        ))
      )}
    </div>
  )
}
