// /api/rewritePrompt.ts

export const config = {
  runtime: "edge",
};

const systemPrompt = `
You are a prompt translator for a fine-tuned MusicGen model. This model is trained on moody, cinematic, slow-to-mid tempo music inspired by 80s retro electronic, italo disco, deep house, and downtempo electronica. It uses rich DX7 synths, sultry or wah-effected guitars, gated drums, atmospheric pads, and arpeggiated basslines.

When a user provides a prompt that doesn’t match this world (e.g. "bluegrass", "EDM", "trap"), your job is to reinterpret the emotional and genre core and rewrite it in this cinematic retro style.

Instructions:
- Choose a BPM between 80–98 (common: 83, 85, 95, 98)
- Start with BPM + style: e.g. "83 bpm. Moody 80s synthscape..."
- Replace modern instruments with retro analog synth equivalents
- Add atmospheric, visual or cinematic settings like:
  - "Feels like a midnight drive by a neon-lit coast."
  - "Evokes a mysterious love story in a foggy Italian city."

Always return a single rewritten music prompt.
`;

export default async function handler(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
    }),
  });

  const result = await response.json();
  const rewritten = result.choices?.[0]?.message?.content?.trim();

  return new Response(JSON.stringify({ rewritten }), {
    headers: { "Content-Type": "application/json" },
  });
}
