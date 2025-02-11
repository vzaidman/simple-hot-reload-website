let currentHRCount = 0;

window.hotreload = async function hotreload({enableSourcesContent}) {
    currentHRCount++;

    if (currentHRCount > 3) {
        alert(`only ${currentHRCount - 1} hot reloads are available in this example.`);
        return;
    }

    await fetch('hotreload', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ version: currentHRCount }),
        method: 'post',
    });

    var script = document.createElement('script');
    script.src = `build/helper.${currentHRCount}.js${enableSourcesContent ? '' : '.no-sources-content.js'}`;
    document.head.appendChild(script);
}
