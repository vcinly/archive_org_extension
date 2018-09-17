function createTable (date, list) {
    let result = `<tr><th colspan="3">${date}</th></tr>`
    list.forEach(l => {
        result += `<tr>
        <td style="width: 177px;">${new Date(l.time).toISOString().slice(0, 19).replace(/T/, ' ')}</td>
        <td>${l.url}</td>
        <td>${l.success}</td>
        </tr>`
    });
    return result
}

chrome.storage.sync.get({ dateList: [], historyList: {} }, function (result) {
    let res = "<table><tbody>"
    Object.keys(result.historyList).forEach(x => {
        res += createTable(x, result.historyList[x])
    })
    document.body.innerHTML = res + "</tbody></table>"
})