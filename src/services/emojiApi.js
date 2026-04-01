const API_URL = "https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQnBZcERpTDlSM0VIMlZnMnFRc1BwTGN2MHlmelRMRTJnWFNOSHo4ajEzYjFVZEVLak9WQ05MUjIzQnM4S21aa2VuUXdqd3BGdjNZdGVVSmJGbmpWTjVMSkxldkE9PQ==";
const MODEL_VERSION = "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e";

export async function generateEmoji(prompt) {
  const formattedPrompt = "A TOK emoji of a " + prompt;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: formattedPrompt,
        replicateModelVersion: MODEL_VERSION
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { success: true, imageUrl: data.imageUrl };
    } else {
      console.error('API error:', data);
      return { success: false, error: 'Failed to generate emoji. Please try again.' };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}
