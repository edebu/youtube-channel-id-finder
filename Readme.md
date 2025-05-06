# YouTube Channel ID Finder

A simple, modern web application to extract the Channel ID from a YouTube channel URL.

![Screenshot of the App](/public/ss.png) <!-- Optional: Add a screenshot URL here -->

## Description

This tool provides a user-friendly interface to quickly find the unique Channel ID (usually starting with `UC...`) for any public YouTube channel. You input the channel's URL, and the application fetches the channel page and extracts the ID.

This is particularly useful because YouTube URLs can come in various formats (e.g., `/user/username`, `/@handle`, `/channel/UC...`), but the underlying Channel ID is a consistent identifier.

## Features

*   Simple and clean user interface.
*   Accepts various YouTube channel URL formats.
*   No YouTube API key required for this basic functionality.
*   Responsive design.
*   Loading indicator during processing.
*   Clear error messages.

## Tech Stack

*   **Frontend:** HTML, CSS, Vanilla JavaScript
*   **Backend:** Node.js, Express.js
*   **Fetching:** `node-fetch` (for server-side HTTP requests)

## Prerequisites

*   Node.js (which includes npm) installed on your system.

## Setup and Installation

1.  **Clone the repository (or download the files):**
    ```bash
    # If you have git
    # git clone https://github.com/edebu/youtube-channel-id-finder.git
    # cd youtube-channel-id-finder
    ```
    If you downloaded the files, navigate to the project directory.

2.  **Install dependencies:**
    Open your terminal or command prompt in the project's root directory and run:
    ```bash
    npm install
    ```
    This will install Express and node-fetch as defined in `package.json`.

## Running the Application

1.  **Start the server:**
    In the project's root directory, run:
    ```bash
    npm start
    ```
    You should see a message like: `Server listening at http://localhost:3000`

2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

## How It Works

When you submit a YouTube channel URL:
1.  The frontend JavaScript sends the URL to a backend API endpoint (`/api/get-channel-id`).
2.  The Node.js/Express server receives the URL.
3.  The server uses `node-fetch` to fetch the HTML content of the provided YouTube channel page.
4.  It then parses the HTML content using regular expressions to find the Channel ID (typically found in a `<meta>` tag or a JavaScript object within the page source).
5.  The extracted Channel ID (or an error message) is sent back to the frontend, which then displays it to the user.

## Important Notes & Limitations

*   **Reliability:** This method relies on parsing the HTML structure of YouTube pages. YouTube can (and does) change its website structure, which might break this tool's ability to find the ID. For a more robust solution, the official YouTube Data API would be necessary, but it requires API keys and quota management.
*   **Rate Limiting:** Making an excessive number of requests in a short period might lead to your server's IP being temporarily blocked or rate-limited by YouTube.
*   **Private/Unavailable Channels:** The tool will likely not work for private channels or URLs that don't point to a valid, public YouTube channel page.

---