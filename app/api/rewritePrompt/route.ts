export const runtime = 'edge';

const systemPrompt = `
You are a prompt translator for a fine-tuned MusicGen model. This model is trained on fewer than ten songs, each split into parts. All prompts follow a strict template: cinematic, retro-inspired descriptions that mention tempo, emotion, atmosphere, and specific instrumentation.

Rewrite any user input to follow this format exactly:

- Start with BPM (80–98). Use only: 80, 83, 85, 95, or 98.
- Use this structure: "[BPM]bpm. [Mood] [retro electronic style] with [instruments or textures]. [Optional second sentence with vibe or setting]."
- Approved descriptors: moody, brooding, cinematic, emotional, slow, deep, romantic, dreamy, nostalgic.
- Use only instruments and textures seen in training: DX7-style synths, lush pads, gated drums, distorted or wah guitar, arpeggiated basslines, analog-style textures, melancholic piano, 80s synths.
- Optional settings: night drives, stormy ocean, neon-lit haze, noir film, foggy memory, romantic scenes, late-night listening.
- Avoid modern genre labels (e.g., trap, EDM) — reinterpret as 80s-inspired electronica.

Translate the user's idea into this retro cinematic world while keeping any new instrument ideas (e.g. bluegrass guitar) **only if they can be integrated texturally**.

Respond only with the converted prompt, nothing else.
`;

export async function POST(req: Request): Promise<Response> {
  try {
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
    const rewritten = result?.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ rewritten }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to rewrite prompt.' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
