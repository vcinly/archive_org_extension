function saveToArchive(url, id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://web.archive.org/save/${url}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let message = 'Page Saved'
            if (xhr.status != 200) {
                console.log(xhr)
                message = "Failed"
                saveToStorage(url, false)
            } else {
                saveToStorage(url)
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

function saveToStorage(url, success = true) {
    let today = new Date().toJSON().slice(0, 10)
    chrome.storage.sync.get({ dateList: [], historyList: {} }, function (result) {
        if (!result.dateList.includes(today)) { result.dateList.unshift(today) }
        result.historyList[today] = result.historyList[today] || []
        result.historyList[today].unshift({ time: Date.now(), url: url, success: success })
        chrome.storage.sync.set({ dateList: result.dateList, historyList: result.historyList }, null)
    });
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

function main() {
    chrome.contextMenus.create({ id: 'history', title: 'History', contexts: ['browser_action'] });
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId === 'history') {
            chrome.tabs.create({ 'url': chrome.extension.getURL('history.html') })
        }
    });

    chrome.browserAction.onClicked.addListener(archivePage)
}

main()