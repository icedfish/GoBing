const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="dns-prefetch" href="https://www.google.com/" />
    <link rel="dns-prefetch" href="https://www.bing.com/" />
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GoBing Search">
    <link rel="icon" href="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" />
    <link rel="apple-touch-icon" href="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" />
    <title>GoBing</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding-top: 15vh;
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
            body {
                padding-top: 10vh;
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 1.5rem;
            }
            #search-input {
                width: 250px;
            }
        }
    </style>
</head>
<body>
    <h1><span>G</span><span>o</span><span>B</span><span>i</span><span>n</span><span>g</span></h1>
    <form id="search-form" action="/#">
        <input type="text" id="search-input" placeholder="Enter your search query" autofocus>
        <div id="search-buttons">
            <button type="button" onclick="search('google')">Google</button>
            <button type="button" onclick="search('bing')">Bing</button>
        </div>
    </form>
    <a id="help-link" href="https://github.com/icedfish/GoBing">Help</a> 
    <span id="version" style="color: gray;"></span>
    <script>
        const cacheDate = new Date('{{cache_date}}');
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
        const hoursAgo = ((now - cacheDate) / (1000 * 60 * 60)).toFixed(1);
        document.getElementById('version').textContent = 'cached @ ' + hoursAgo + ' hours ago';
    </script>
    <script>
        function search(engine) {
            const query = encodeURIComponent(document.getElementById('search-input').value);
            const url = engine === 'google' 
                ? 'https://www.google.com/search?q=' + query
                : 'https://www.bing.com/search?q=' + query;

            window.location.href = url;
        }

        function checkGoogleConnectivity(callback) {
            fetch('https://www.google.com/generate_204', { 
                mode: 'no-cors',
                cache: 'no-store',
                signal: AbortSignal.timeout(1000)
            })
            .then((response) => {
                window.googleAvailable = true;
                callback();
            })
            .catch(() => {
                window.googleAvailable = false;
                callback();
            });
        }

        function autoSearch() {
            const query = document.getElementById('search-input').value;
            if (query) {
                if (window.googleAvailable) {
                    search('google');
                } else {
                    search('bing');
                }
            }
            return false;
        }

        function checkQuery() {
            checkGoogleConnectivity(() => {
                const query = window.location.hash.slice(1);
                if (query) {
                    document.getElementById('search-input').value = decodeURIComponent(query);
                    autoSearch();
                }
            });
        }

        document.getElementById('search-form').onsubmit = autoSearch;
        window.onload = checkQuery;
    </script>
</body>
</html>`;

// https://github.com/dewitt/opensearch/blob/master/opensearch-1-1-draft-6.md
const opensearchXml = `<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>GoBing</ShortName>
  <Description>Gobing Search</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Language>*</Language>
  <Image width="32" height="32" type="image/x-icon">https://www.google.com/favicon.ico</Image>
  <Url type="text/html" method="get" template="https://gobing.yubing.work/#{searchTerms}"/>
</OpenSearchDescription>`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const cache_date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
  
  if (url.pathname === '/') {
    return new Response(html.replace('{{cache_date}}', cache_date), {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=2592000, immutable',
        'Expires': new Date(Date.now() + 2592000000).toUTCString()
      }
    });
  } else if (url.pathname === '/opensearch.xml') {
    return new Response(opensearchXml, {
      headers: {
        'Content-Type': 'application/opensearchdescription+xml',
      }
    });
  } else {
    return Response.redirect('https://github.com/icedfish/GoBing', 302);
  }
}
