"use client"

import { useState, useEffect } from "react"

interface Todo {
  id: string
  text: string
  completed: boolean
  date: string
}

const DAYS = ["日", "月", "火", "水", "木", "金", "土"]
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("planly-todos")
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("planly-todos", JSON.stringify(todos))
  }, [todos])

  const getDateKey = (date: Date) => date.toISOString().split("T")[0]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    const days: (Date | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    return days
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        date: getDateKey(selectedDate),
      }
      setTodos((prev) => [...prev, todo])
      setNewTodo("")
    }
  }

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString()
  const isSelected = (date: Date) => date.toDateString() === selectedDate.toDateString()

  const todoCountByDate = todos.reduce<Record<string, number>>((acc, todo) => {
    if (!todo.completed) acc[todo.date] = (acc[todo.date] || 0) + 1
    return acc
  }, {})

  const filteredTodos = todos.filter((todo) => todo.date === getDateKey(selectedDate))
  const completedCount = filteredTodos.filter((t) => t.completed).length
  const totalCount = filteredTodos.length

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = DAYS[date.getDay()]
    return `${month}月${day}日（${weekday}）`
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <main className="min-h-screen bg-slate-50 p-4 pb-8 max-w-md mx-auto">
      <header className="pt-2 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Planly</h1>
        <p className="text-sm text-slate-500">あなたの予定を管理</p>
      </header>

      <div className="flex flex-col gap-4">
        {/* 保存メッセージ */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-slate-600">タスクはローカルストレージに自動保存されます。</p>
          </div>
        </div>

        {/* カレンダー */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {currentMonth.getFullYear()}年 {MONTHS[currentMonth.getMonth()]}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day, index) => (
              <div
                key={day}
                className={`text-center text-xs font-medium py-2 ${
                  index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-slate-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="aspect-square" />
              const dateKey = getDateKey(date)
              const todoCount = todoCountByDate[dateKey] || 0
              const dayOfWeek = date.getDay()

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all relative
                    ${isSelected(date) ? "bg-blue-500 text-white" : "hover:bg-slate-100"}
                    ${isToday(date) && !isSelected(date) ? "ring-2 ring-blue-500 ring-inset" : ""}
                    ${dayOfWeek === 0 && !isSelected(date) ? "text-red-500" : ""}
                    ${dayOfWeek === 6 && !isSelected(date) ? "text-blue-500" : ""}
                  `}
                >
                  <span>{date.getDate()}</span>
                  {todoCount > 0 && (
                    <span
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                        isSelected(date) ? "bg-white" : "bg-blue-500"
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* TODOリスト */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isToday(selectedDate) ? "今日のタスク" : formatDate(selectedDate)}
              </h2>
              {totalCount > 0 && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {completedCount}/{totalCount} 完了
                </p>
              )}
            </div>
            {totalCount > 0 && (
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-900">
                  {Math.round((completedCount / totalCount) * 100)}%
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新しいタスクを追加..."
              className="flex-1 h-11 px-4 rounded-xl bg-slate-100 border-0 placeholder:text-slate-400 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="h-11 w-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shrink-0 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">タスクがありません</p>
                <p className="text-slate-400 text-xs mt-1">上のフォームから追加してください</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                    todo.completed ? "bg-slate-50" : "bg-slate-100"
                  }`}
                >
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      todo.completed
                        ? "bg-blue-500 border-blue-500"
                        : "border-slate-300 hover:border-blue-500"
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm transition-all ${
                      todo.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
