'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Database } from '@/lib/database.types'

type Event = Database['public']['Tables']['events']['Row']

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'open')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('이벤트 불러오기 오류:', error)
    } else {
      setEvents(data ?? [])
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏁 진행 중인 이벤트</h1>
        <Link href="/">
          <button className="px-4 py-2 bg-gray-500 text-white rounded">홈으로</button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-600">진행 중인 이벤트가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded hover:shadow bg-white">
              <Link
                href={`/events/${event.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {event.title ?? '제목 없음'}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {(event.start_date ? new Date(event.start_date).toLocaleDateString() : '시작일 없음')} ~{' '}
                {(event.end_date ? new Date(event.end_date).toLocaleDateString() : '종료일 없음')}
              </p>
              <p className="mt-2 text-gray-800">{event.description ?? '설명이 없습니다.'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
