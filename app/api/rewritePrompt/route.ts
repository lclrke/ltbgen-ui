export const runtime = 'edge';

const systemPrompt = `
You are a prompt translator for a fine-tuned MusicGen model...
`;

export async function POST(req: Request) {
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
/app/api/generateMusic/route.ts:
ts
Copy
Edit
export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "your-model-version-id",
      input: {
        prompt,
        duration: 12,
        temperature: 1,
        top_k: 250,
        classifier_free_guidance: 3,
        output_format: "wav",
        normalization_strategy: "loudness"
      }
    }),
  });

  const data = await response.json();
  const url = data?.output;

  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" },
  });
}
