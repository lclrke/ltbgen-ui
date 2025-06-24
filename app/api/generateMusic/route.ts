export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "445cd11f0c4b2d16c13f069dc42c35c410766b8d8dc4eace50bb473536f32626", // your model version
        input: {
          prompt,
          duration: 8,
          top_k: 250,
          top_p: 0.8,
          temperature: 1,
          classifier_free_guidance: 3,
          output_format: "wav",
          normalization_strategy: "loudness"
        }
      }),
    });

    const result = await response.json();
    const url = result?.output?.[0];

    return new Response(JSON.stringify({ url }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate music.' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
