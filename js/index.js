window.addEventListener('load', async () => {
    await getApks();
    // await getiOSPreviews();

    const previewID = await getiOSPreview();

    const apkButtons = document.querySelectorAll('.dropdown-item');
    
    
    apkButtons.forEach((apkButton) => {
        apkButton.addEventListener('click', handleClick);
    });

    const playStoreButton = document.getElementById('play-store-button');
    playStoreButton.addEventListener('click', () => {
        window.open('https://play.google.com/store/apps/details?id=com.joshsj89.ChordMemo', '_blank');
    })

    const appStoreButton = document.getElementById('app-store-button');
    appStoreButton.addEventListener('click', () => {
        window.open(`exp://u.expo.dev/update/${previewID}`, '_blank');
    })

    const apkButton = document.getElementById('apk-button');
    const dropdown = document.getElementById('version-dropdown');
    apkButton.addEventListener('click', () => dropdown.classList.toggle('show'));
});

const handleClick = async (e) => {
    e.preventDefault();
    
    const apkButton = document.getElementById('apk-button');
    const downloadID = apkButton.getAttribute('download-id');
    const downloadID2 = e.target.getAttribute('download-id');
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.android.package-archive'
        }
    }

    try {
        const responseInfo = await fetch(`https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/${downloadID}/${downloadID2}`, options);
        const response = await fetch(`https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/download/${downloadID}/${downloadID2}`, options);

        if (!response.ok || !responseInfo.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await responseInfo.json();

        const contentLength = +response.headers.get('Content-Length');
        let loaded = 0;

        const progressBar = document.querySelector('.progress-bar-wrapper');
        const fill = document.querySelector('.progress-bar-fill');

        progressBar.style.display = 'block';

        const stream = new ReadableStream({ // create a new ReadableStream
            start(controller) { // start method that is called when the stream is started
                const reader = response.body?.getReader(); // get ReedableStream from response body

                const read = async () => { // read method that is called recursively
                    const { done, value } = await reader.read(); // read the next chunk of data

                    if (done) { // if there is no more data (value is undefined as well)
                        controller.close(); // close the stream
                        return;
                    }

                    loaded += value.byteLength; // increase the loaded counter by the length of the chunk
                    const percentageComplete = Math.round((loaded / contentLength) * 100) + '%'; // calculate the percentage of the download
                    fill.style.width = percentageComplete;
                    fill.textContent = percentageComplete;

                    controller.enqueue(value); // enqueue the chunk of data

                    read(); // call read recursively
                };

                read();
            }
        });

        const newResponse = new Response(stream);
        const blob = await newResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.fileName}.apk`;
        link.click();

        progressBar.style.display = 'none';
        fill.style.width = '0%';
        fill.textContent = '0%';
    } catch (error) {
        console.error('Error Downloading App: ', error);
    }
}

const getApks = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch('https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/versions/descending/64f3edf1d11932398c0807ee', options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const apks = data.apk;

        apks.forEach((apk) => {
            const dropdown = document.getElementById('version-dropdown');
            const button = document.createElement('button');
            button.setAttribute('class', 'dropdown-item');
            button.setAttribute('download-id', apk._id);
            button.textContent = apk.version;
            dropdown.appendChild(button);
        });
    } catch (error) {
        console.error('Error Fetching Apps: ', error);
    }
}

/*
const getiOSPreviews = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch('https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/versions/ios/descending/6502bd7d22d33d5d9e7bd2e1', options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const previews = data.preview;

        previews.forEach((preview) => {
            const dropdown = document.getElementById('version-dropdown');
            const button = document.createElement('button');
            button.setAttribute('class', 'dropdown-item');
            button.setAttribute('download-id', preview._id);
            button.textContent = preview.version;
            dropdown.appendChild(button);
        });
    } catch (error) {
        console.error('Error Fetching Apps: ', error);
    }
}
*/

const getiOSPreview = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch('https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/versions/ios/descending/6502bd7d22d33d5d9e7bd2e1', options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const preview = data.preview[0];

        return preview.previewID;
    } catch (error) {
        console.error('Error Fetching Apps: ', error);
    }
}