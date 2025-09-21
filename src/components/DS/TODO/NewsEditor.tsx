'use client';

import { useState } from 'react';

export default function NewsEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendToDiscord, setSendToDiscord] = useState(true);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, sendToDiscord }),
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      setMessage('News published');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        className="w-full p-2 rounded bg-white/5 border border-white/10"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenu en Markdown"
        className="w-full h-48 p-2 rounded bg-white/5 border border-white/10"
        required
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={sendToDiscord}
          onChange={(e) => setSendToDiscord(e.target.checked)}
        />
        <span>Diffuser sur Discord</span>
      </label>
      <button type="submit" className="px-4 py-2 bg-cyan-600 rounded text-white">
        Publier
      </button>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </form>
  );
}
