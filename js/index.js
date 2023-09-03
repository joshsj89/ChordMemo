window.addEventListener('load', async () => {
    await getApks();

    const apkButtons = document.querySelectorAll('.dropdown-item');
    
    
    apkButtons.forEach((apkButton) => {
        apkButton.addEventListener('click', handleClick);
    });

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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.fileName;
        link.click();
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