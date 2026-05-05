"use client";
import React, { useState, useEffect } from 'react';

export default function CalendarTodoApp() {
  const [todos, setTodos] = useState<{ id: number; text: string; date: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // ブラウザ保存（LocalStorage）から読み込み
  useEffect(() => {
    const saved = localStorage.getItem('my-todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // 変更があるたびに保存
  useEffect(() => {
    localStorage.setItem('my-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue) return;
    setTodos([...todos, { id: Date.now(), text: inputValue, date: selectedDate }]);
    setInputValue('');
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">シンプル カレンダーTODO</h1>
      
      <div className="flex gap-4 mb-8 p-4 bg-gray-100 rounded-lg">
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="TODOを入力..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 flex-grow rounded"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">追加</button>
      </div>

      <div className="space-y-4">
        {todos.filter(t => t.date === selectedDate).length === 0 && <p className="text-gray-500">この日の予定はありません</p>}
        {todos.filter(t => t.date === selectedDate).map(todo => (
          <div key={todo.id} className="flex justify-between items-center border-b pb-2">
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 text-sm">削除</button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-xs text-gray-400">
        ※データはブラウザ（LocalStorage）に保存されています。
      </div>
    </div>
  );
}