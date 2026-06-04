<script>
  (function () {
    const LOCALHOST_URL = [
      'http://localhost:3000/@vite/client',
      'http://localhost:3000/src/main.js',
    ]
    const PROD_URL = ['https://tbd.netlify.app/main.js']

    function createScripts(arr, isDevMode) {
      return arr.map((url) => {
        const s = document.createElement('script')
        s.src = url
        if (isDevMode) s.type = 'module'
        return s
      })
    }

    function insertScript(scriptArr) {
      scriptArr.forEach((script) => document.body.appendChild(script))
    }

    function fetchWithTimeout(url, timeout) {
      return Promise.race([
        fetch(url, { method: 'HEAD' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ])
    }

    const localhostScripts = createScripts(LOCALHOST_URL, true)
    const prodScripts = createScripts(PROD_URL, false)

    fetchWithTimeout(LOCALHOST_URL[0], 150) // short timeout
      .then(() => insertScript(localhostScripts))
      .catch(() => insertScript(prodScripts))
  })()
</script>
