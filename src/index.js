const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend domain e.g., 'https://your-frontend.com'
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handles incoming requests, extracts YouTube Channel ID, and includes CORS headers.
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only respond to POST requests on the specified path
  if (request.method === 'POST' && url.pathname === '/api/get-channel-id') {
    try {
      const body = await request.json()
      const { youtubeUrl } = body

      if (!youtubeUrl) {
        return new Response(
          JSON.stringify({ error: 'YouTube URL is required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      // Fetch the YouTube page
      const resp = await fetch(youtubeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!resp.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to fetch URL: ${resp.status} ${resp.statusText}` }),
          { status: resp.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      const html = await resp.text()

      // Extract Channel ID using regex
      const externalMatch = html.match(/"externalId":"(UC[\w-]{22})"/)
      const metaMatch = html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{22})"/)
      const match = externalMatch || metaMatch

      if (match && match[1]) {
        return new Response(
          JSON.stringify({ channelId: match[1] }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      } else {
        return new Response(
          JSON.stringify({ error: 'Could not find Channel ID. The URL might be incorrect, private, or the page structure might have changed.' }),
          { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

    } catch (err) {
      console.error("Error processing request:", err); // Log the error for debugging
      return new Response(
        JSON.stringify({ error: 'An error occurred while processing the URL.', details: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
  }

  // For any other requests, return 404
  return new Response('Not found', { status: 404, headers: corsHeaders }) // Also add CORS headers to 404 for consistency
}
  