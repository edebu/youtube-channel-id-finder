const form = document.getElementById('channel-form');
const urlInput = document.getElementById('youtube-url');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const youtubeUrl = urlInput.value.trim();
    if (!youtubeUrl) {
        errorDiv.textContent = 'Please enter a YouTube Channel URL.';
        resultDiv.textContent = '';
        return;
    }

    // Clear previous results and show loading indicator
    resultDiv.textContent = '';
    errorDiv.textContent = '';
    loadingDiv.style.display = 'block';

    try {
        const response = await fetch('/api/get-channel-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ youtubeUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw error to be caught by the catch block
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        resultDiv.textContent = `Channel ID: ${data.channelId}`;

    } catch (err) {
        errorDiv.textContent = `Error: ${err.message}`;
    } finally {
        loadingDiv.style.display = 'none'; // Hide loading indicator
    }
});