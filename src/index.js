addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  /**
   * YouTube kanal URL’sinden Channel ID’yi çekip JSON dönen Worker fonksiyonu
   * @param {Request} request
   */
  async function handleRequest(request) {
    const url = new URL(request.url)
  
    // Sadece POST /api/get-channel-id isteğine yanıt ver
    if (request.method === 'POST' && url.pathname === '/api/get-channel-id') {
      try {
        const body = await request.json()
        const { youtubeUrl } = body
  
        if (!youtubeUrl) {
          return new Response(
            JSON.stringify({ error: 'YouTube URL is required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
  
        // YouTube sayfasını fetch et
        const resp = await fetch(youtubeUrl, {
          headers: {
            // Tarayıcı user-agent taklidi
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
  
        if (!resp.ok) {
          return new Response(
            JSON.stringify({ error: `Failed to fetch URL: ${resp.status} ${resp.statusText}` }),
            { status: resp.status, headers: { 'Content-Type': 'application/json' } }
          )
        }
  
        const html = await resp.text()
  
        // Channel ID’yi regex ile yakala
        const externalMatch = html.match(/"externalId":"(UC[\w-]{22})"/)
        const metaMatch     = html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{22})"/)
        const match = externalMatch || metaMatch
  
        if (match && match[1]) {
          return new Response(
            JSON.stringify({ channelId: match[1] }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        } else {
          return new Response(
            JSON.stringify({ error: 'Could not find Channel ID. The URL might be incorrect, private, or the page structure might have changed.' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          )
        }
  
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'An error occurred while processing the URL.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  
    // Diğer tüm isteklerde static dosya servisi ya da 404
    // Eğer Worker’ı sadece API için kullanıyorsan, diğer her isteğe 404 dönebilirsin:
    return new Response('Not found', { status: 404 })
  }
  