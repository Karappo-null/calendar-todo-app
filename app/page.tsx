"use client";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // カレンダーの基本スタイル

// 型の定義
type Todo = { id: number; text: string; date: string; completed: boolean };

export default function MobileCalendarApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 日付を文字列(YYYY-MM-DD)に変換する関数
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem('calendar-todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      date: formatDate(selectedDate),
      completed: false
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // 選択中の日付のTODOだけを抽出
  const filteredTodos = todos.filter(t => t.date === formatDate(selectedDate));

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 border-x">
      {/* 上半分：カレンダーエリア */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-2">My Calendar</h1>
        <div className="flex justify-center">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            locale="ja-JP"
            className="border-none shadow-none text-sm"
          />
        </div>
      </div>

      {/* 下半分：TODOエリア */}
      <div className="flex-1 flex flex-col min-h-0 bg-white mt-2 rounded-t-3xl shadow-inner">
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-md font-semibold text-gray-600 mb-4">
            {selectedDate.toLocaleDateString('ja-JP')} の予定
          </h2>
          
          <div className="space-y-3">
            {filteredTodos.length === 0 && (
              <p className="text-gray-400 text-sm italic">予定がありません</p>
            )}
            {filteredTodos.map(todo => (
              <div key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded-full accent-blue-500"
                  />
                  <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-300 hover:text-red-500 transition-colors">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 入力エリア（画面下部に固定） */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="新しいTODOを追加..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button 
              onClick={addTodo}
              className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200"
            >
              ＋
            </button>
          </div>
        </div>
      </div>

      {/* react-calendarのスタイル調整用（簡易） */}
      <style jsx global>{`
        .react-calendar { width: 100% !important; border: none !important; font-family: inherit; }
        .react-calendar__tile--active { background: #3b82f6 !important; border-radius: 8px; }
        .react-calendar__tile--now { background: #dbeafe !important; border-radius: 8px; }
      `}</style>
    </div>
  );
}