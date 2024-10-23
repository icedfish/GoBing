const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoBing</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        h1 {
            font-size: 4rem;
            margin-bottom: 2rem;
        }
        h1 span:nth-child(1) { color: #4285F4; }
        h1 span:nth-child(2) { color: #EA4335; }
        h1 span:nth-child(3) { color: #FBBC05; }
        h1 span:nth-child(4) { color: #4285F4; }
        h1 span:nth-child(5) { color: #34A853; }
        h1 span:nth-child(6) { color: #EA4335; }
        #search-form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #search-input {
            width: 300px;
            padding: 10px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        #search-buttons {
            display: flex;
            gap: 1rem;
        }
        button {
            padding: 10px 20px;
            font-size: 1rem;
            cursor: pointer;
        }
        #help-link {
            margin-top: 2rem;
        }
        @media (max-width: 600px) {
            h1 {
                font-size: 3rem;
            }
            #search-input {
                width: 250px;
            }
        }
    </style>
</head>
<body>
    <h1><span>G</span><span>o</span><span>B</span><span>i</span><span>n</span><span>g</span></h1>
    <form id="search-form">
        <input type="text" id="search-input" placeholder="Enter your search query">
        <div id="search-buttons">
            <button type="button" onclick="search('google')">Google</button>
            <button type="button" onclick="search('bing')">Bing</button>
        </div>
    </form>
    <a id="help-link" href="https://github.com/icedfish/GoBing">Help</a>
    <script>
        function search(engine) {
            const query = encodeURIComponent(document.getElementById('search-input').value);
            const url = engine === 'google' 
                ? 'https://www.google.com/search?q=' + query
                : 'https://www.bing.com/search?q=' + query;
            window.location.href = url;
        }

        function checkConnectivity() {
            const query = window.location.hash.slice(1);
            if (query) {
                document.getElementById('search-input').value = decodeURIComponent(query);
                fetch('https://www.google.com/generate_204', { 
                    mode: 'no-cors',
                    cache: 'no-store',
                    signal: AbortSignal.timeout(500)
                })
                .then(() => search('google'))
                .catch(() => search('bing'));
            }
        }

        window.onload = checkConnectivity;
    </script>
</body>
</html>`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/') {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=2592000'
      }
    });
  } else {
    return Response.redirect('https://github.com/icedfish/GoBing', 302);
  }
}
