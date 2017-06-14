
const JIRA_SERVER = 'sentinel2.luxoft.com/sen/issues/browse';

var bkg = chrome.extension.getBackgroundPage();
bkg.console.log('Staring Jira Dev Helper');

document.addEventListener('DOMContentLoaded', function() {

    getCurrentTabUrl(function(url) {
        bkg.console.log('Active url: ' + url);

        if (isValidJiraIssueUrl(url)) {
            getIssueContent(url, function(content) {
                showMessage('Task: ' + content.fields.summary);
            }, function(errorMessage) {
                showMessage('Cannot load data: ' + errorMessage);
            })
        } else {
            showMessage("Extension works only on jira issue page!");
        }
    });
});

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });
}

function getIssueContent(issueId, callback, errorCallback) {
    var requestUrl = 'https://sentinel2.luxoft.com/sen/issues/rest/api/2/issue/993619';
    var x = new XMLHttpRequest();
    x.open('GET', requestUrl);
    x.responseType = 'json';
    x.onload = function() {
        // Parse and process the response from Google Image Search.
        var response = x.response;
        bkg.console.log(response);

        if (!response) {
            errorCallback('No response from Jira server!');
            return;
        }
        callback(response);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}


function isValidJiraIssueUrl(url) {
    return url.indexOf(JIRA_SERVER) > 0;
}

function switchElement(id, show) {
    document.getElementById(id).style.display = show ? 'block' : 'none';
}

function showForm() {
    switchElement('loader', false);
    switchElement('message', false);
    switchElement('createForm', true);
}
function showMessage(message) {
    switchElement('loader', false);
    switchElement('createForm', false);
    switchElement('message', true);
    document.getElementById('message').textContent = message;
}
