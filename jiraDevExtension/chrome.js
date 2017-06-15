"use strict";

function saveSettings(reviewer) {
// Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'reviewer': reviewer}, function () {
        bkg.console.log('saveSettings');
    });
}

function readSettings(callback) {
// Read it using the storage API
    chrome.storage.sync.get(['reviewer'], function (items) {
        bkg.console.log('readSettings: ');
        bkg.console.log(items);
        if (items['reviewer']) {
            callback(items['reviewer']);
        }
    });
}

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

