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
