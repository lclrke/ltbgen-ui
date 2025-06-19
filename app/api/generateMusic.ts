// app/api/generateMusic.ts

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "445cd11f0c4b2d16c13f069dc42c35c410766b8d8dc4eace50bb473536f3dc04", // your model version
      input: {
        prompt,
        duration: 8,
        temperature: 1,
        top_k: 250,
        top_p: 0,
        continuation: false,
        output_format: "wav",
        continuation_start: 0,
        multi_band_diffusion: false,
        normalization_strategy: "loudness",
        classifier_free_guidance: 3,
      },
    }),
  });

  const result = await response.json();
  const url = result.output;

  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" },
  });
}
