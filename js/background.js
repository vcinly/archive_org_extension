function saveToArchive(url, id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://web.archive.org/save/${url}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let message = 'Page Saved'
            if (xhr.status != 200) {
                message = "Failed"
            }
            chrome.notifications.update(id, {
                message: message,
                requireInteraction: false
            })
            setTimeout(() => {
                chrome.notifications.clear(id)
            }, 1500);
        }
    }
    xhr.send();
}

function archivePage() {
    chrome.tabs.getSelected(null, function (tab) {
        var tablink = tab.url;
        let id = Date.now().toString()
        chrome.notifications.create(id, {
            type: 'basic',
            iconUrl: './logo_archive-sm.png',
            title: 'Archive',
            message: `Saving... ${tablink}`,
            requireInteraction: true,
        });
        saveToArchive(tablink, id)
    });
}

chrome.browserAction.onClicked.addListener(archivePage)