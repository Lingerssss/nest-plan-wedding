'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  weddingDate: Date | string
}

export default function Countdown({ weddingDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date(weddingDate).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [weddingDate])

  return (
    <div className="text-center p-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">婚礼倒计时</h2>
      <div className="flex justify-center gap-4">
        <div className="bg-white/20 rounded-lg p-4 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-sm">天</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm">小时</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm">分钟</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm">秒</div>
        </div>
      </div>
    </div>
  )
}
