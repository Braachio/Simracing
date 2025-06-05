'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import Link from 'next/link'

type Multi = Database['public']['Tables']['multis']['Row']

export default function MultiCard({
  multi,
  currentUserId,
}: {
  multi: Multi
  currentUserId: string | null
}) {
  const supabase = createClientComponentClient<Database>()
  const [isOpen, setIsOpen] = useState(multi.is_open)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthor = currentUserId === multi.author_id

  const toggleOpen = async () => {
    if (!isAuthor || isLoading) return

    setIsLoading(true)

    const { error } = await supabase
      .from('multis')
      .update({ is_open: !isOpen })
      .eq('id', multi.id)

    if (!error) setIsOpen(!isOpen)
    else alert(`상태 변경 실패: ${error.message}`)

    setIsLoading(false)
  }

  return (
    <div className="border p-4 rounded shadow mb-3 bg-white">
      <div className="flex justify-between items-start">
        <Link href={`/multis/${multi.id}`}>
          <h2 className="text-lg font-semibold hover:underline mb-1">
            {multi.title}
          </h2>
        </Link>
        <div>
          {isAuthor ? (
            <button
              onClick={toggleOpen}
              disabled={isLoading}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap ml-2 ${
                isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isOpen ? '✅ ON' : '❌ OFF'}
            </button>
          ) : (
            <span className="text-xs text-gray-500 ml-2">
              {isOpen ? '✅ ON' : '❌ OFF'}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{multi.created_at ? new Date(multi.created_at).toLocaleString(): '날짜 없음'}</p>
      <p className="text-sm">🧭 <strong>클래스:</strong> {multi.multi_class}</p>
      <p className="text-sm">📅 <strong>오픈 시간:</strong> {multi.multi_day?.join(', ')} {multi.multi_time && `${multi.multi_time}`}</p>
    </div>
  )
}
