import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// API Endpoint to get Channel ID
app.post('/api/get-channel-id', async (req, res) => {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
        return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    try {
        console.log(`Fetching URL: ${youtubeUrl}`);
        // Fetch the HTML content of the YouTube channel page
        const response = await fetch(youtubeUrl, {
            headers: {
                // Mimic a browser user agent to avoid simple blocks
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();

        // Look for the channel ID using a regular expression
        // Common patterns: "externalId":"UC..." or <meta itemprop="channelId" content="UC...">
        const match = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{22})"/);

        if (match && match[1]) {
            const channelId = match[1];
            console.log(`Found Channel ID: ${channelId}`);
            res.json({ channelId });
        } else {
            console.error('Could not find Channel ID in the page source.');
            res.status(404).json({ error: 'Could not find Channel ID. The URL might be incorrect, private, or the page structure might have changed.' });
        }
    } catch (error) {
        console.error('Error fetching or parsing YouTube URL:', error);
        res.status(500).json({ error: 'An error occurred while processing the URL.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});