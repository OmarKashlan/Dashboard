const sheetDBUrl = 'https://sheetdb.io/api/v1/u26csaknna97q';

document.getElementById('mediaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('mediaFile').files[0];
    const description = document.getElementById('mediaDescription').value;

    // Upload file to a public hosting service like Imgur or use base64 (for simplicity, assuming base64 here)
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

        // Save the file URL (base64) and description to Google Sheets via SheetDB
        await fetch(sheetDBUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { 'File URL': `data:${file.type};base64,${base64String}`, 'Description': description } })
        });

        displayMedia();
    };
    reader.readAsDataURL(file);
});

async function displayMedia() {
    const mediaList = document.getElementById('mediaList');
    mediaList.innerHTML = '';
    const response = await fetch(sheetDBUrl);
    const data = await response.json();

    data.forEach(item => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
            ${item['File URL'].includes('video') ? `<video src="${item['File URL']}" controls></video>` : `<img src="${item['File URL']}" alt="${item['Description']}">`}
            <p>${item['Description']}</p>
        `;
        mediaList.appendChild(mediaItem);
    });
}

displayMedia();
