export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { predictionId } = await req.json();

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    const prediction = await response.json();
    
    return new Response(JSON.stringify({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to check prediction.' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
