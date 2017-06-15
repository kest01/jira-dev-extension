"use strict";

var bkg = chrome.extension.getBackgroundPage();
bkg.console.log('Staring Jira Dev Helper');

var jiraClient = new JiraClient();

var parentIssueContent = null;
var reviewIssueContent = null;

document.addEventListener('DOMContentLoaded', function() {
    parentIssueContent = null;
    reviewIssueContent = null;

    getCurrentTabUrl(function(url) {
        bkg.console.log('Active url: ' + url);

        var button = document.getElementById('createButton');
        button.addEventListener('click', onCreateButtonClick);

        if (isValidJiraIssueUrl(url)) {
            jiraClient.getIssueData(getIssueId(url), function(content) {
                if (isValidDevTask(content)) {
                    parentIssueContent = content;
                    showForm();
                } else {
                    showMessage('Эта таска не похожа на правильную Dev Jira задачу');
                }

            }, function(errorMessage) {
                showMessage('Cannot load data: ' + errorMessage);
            });

        } else {
            showMessage("Плагин работает только на страницах с Jira задачами");
        }
    });
});

function onCreateButtonClick() {
    // bkg.console.log('on button click');
    var reviewDescription = document.getElementById('reviewDescription').value;
    var reviewer = document.getElementById('reviewer').value;

    if (!parentIssueContent) {
        alert("Не найдены данные родительской задачи");
        return;
    }
    if (!reviewDescription) {
        alert("Не заполнено поле со ссылкой на Upsource review");
        return;
    }
    showLoader();
    jiraClient.createReviewIssue(parentIssueContent, reviewDescription, reviewer, function(content) {
        reviewIssueContent = content;

        jiraClient.linkIssues(parentIssueContent.key, reviewIssueContent.key, function() {

            showMessage('Задача на ревью создана: <a href="' + jiraClient.baseWebUrl + reviewIssueContent.key + '">'
                + reviewIssueContent.key+ '</a>');

        }, function(errorMessage) {
            showMessage('Cannot load data: ' + errorMessage);
        });
    }, function(errorMessage) {
        showMessage('Cannot load data: ' + errorMessage);
    })
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

function isValidJiraIssueUrl(url) {
    return url.indexOf(jiraClient.baseWebUrl) > 0;
}

function isValidDevTask(json) {
    return json.fields.issuetype.name === 'Task'
        && json.fields.summary.indexOf('DEV') > -1
        && json.fields.summary.indexOf('[CRR]') === -1
}

function getIssueId(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

function switchElement(id, show) {
    document.getElementById(id).style.display = show ? 'block' : 'none';
}

function showLoader() {
    switchElement('loader', true);
    switchElement('message', false);
    switchElement('createForm', false);
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
    document.getElementById('message').innerHTML = message;
}
