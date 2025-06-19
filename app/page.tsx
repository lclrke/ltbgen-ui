'use client';

import { useState } from 'react';

export default function Home() {
  const [userPrompt, setUserPrompt] = useState('');
  const [rewritten, setRewritten] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAudioUrl('');
    setRewritten('');

    // Rewrite the prompt with Groq
    const rewriteRes = await fetch('/api/rewritePrompt', {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt }),
    });
    const { rewritten } = await rewriteRes.json();
    setRewritten(rewritten);

    // Generate music with Replicate
    const genRes = await fetch('/api/generateMusic', {
      method: 'POST',
      body: JSON.stringify({ prompt: rewritten }),
    });
    const { url } = await genRes.json();
    setAudioUrl(url);
    setLoading(false);
  };

  return (
    <main style={{ background: '#fff', minHeight: '100vh', padding: '2rem', fontFamily: 'Inter, sans-serif', color: '#111' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '1.5rem' }}>LTB MusicGen Playground</h1>

      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Your prompt</label>
      <textarea
        rows={4}
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Describe your musical idea..."
        style={{
          width: '100%',
          background: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '1rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          color: '#222',
          fontFamily: 'inherit'
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          backgroundColor: '#111',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Audio'}
      </button>

      {rewritten && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '6px' }}>
          <strong>Rewritten Prompt:</strong>
          <p style={{ marginTop: '0.5rem', color: '#333' }}>{rewritten}</p>
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: '2rem' }}>
          <audio controls src={audioUrl} />
        </div>
      )}
    </main>
  );
}
