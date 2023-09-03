window.addEventListener('load', () => {
    const apkButton = document.getElementById('apk-button');




    apkButton.addEventListener('click', handleClick);
})


const handleClick = async (e) => {
    e.preventDefault();
    const downloadID = e.target.getAttribute('download-id');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.android.package-archive'
        }
    }

    try {
        const responseInfo = await fetch(`https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/${downloadID}`, options);
        const response = await fetch(`https://joshsj89-1d7a9e7057c7.herokuapp.com/api/apps/download/${downloadID}`, options);

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