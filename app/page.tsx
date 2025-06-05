'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface MeResponse {
  id: string
  username: string
}

export default function HomePage() {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [views, setViews] = useState<number | null>(null)

  // 로그인 및 조회수 증가
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const { user } = await res.json()
          setUser(user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('사용자 정보 확인 실패:', err)
        setUser(null)
      }
    }

    const incrementViews = async () => {
      try {
        await fetch('/api/incrementView', { method: 'POST' }) // 증가만
      } catch (err) {
        console.error('조회수 증가 실패:', err)
      }
    }

    checkLogin()
    incrementViews()
  }, [])

  // 조회수 표시용
  useEffect(() => {
    const loadViews = async () => {
      try {
        const res = await fetch('/api/getView')
        if (res.ok) {
          const { view_count } = await res.json()
          setViews(view_count)
        }
      } catch (err) {
        console.error('조회수 로드 실패:', err)
      }
    }

    loadViews()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 상단 사용자 정보 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm text-gray-600">
          {user ? `👤 ${user.username}님 환영합니다` : '🕵 로그인되지 않음'}
        </h2>
        {!user && (
          <Link href="/login" className="px-4 py-2 bg-gray-600 text-white rounded">
            로그인
          </Link>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <h1 className="text-3xl font-bold mb-6">🏁 심레이싱 메인</h1>

      <div className="space-x-4 mb-6">
        <Link href="/multis">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">공지 모음</button>
        </Link>
        {/* 향후 확장용
        <Link href="/events">
          <button className="px-4 py-2 bg-green-600 text-white rounded">이벤트 보기</button>
        </Link>
        <Link href="/community">
          <button className="px-4 py-2 bg-purple-600 text-white rounded">커뮤니티</button>
        </Link>
        */}
      </div>

      {/* 조회수 표시 */}
      {views !== null && (
        <p className="text-sm text-gray-500">👁️ 총 방문수: {views.toLocaleString()}회</p>
      )}
    </div>
  )
}
