"use strict";

function JiraClient() {
    this.baseRestUrl = 'https://sentinel2.luxoft.com/sen/issues/rest/api/2/';
    this.baseWebUrl = 'https://sentinel2.luxoft.com/sen/issues/browse/';
}

JiraClient.prototype.createReviewIssue =  function (parentIssue, reviewDescription, reviewer, callback, errorCallback) {
    var request = {
        fields: {
            "project": {
                "key": parentIssue.fields.project.key
            },
            "summary": '[CRR]' + parentIssue.fields.summary,
            "description": reviewDescription,
            "issuetype": {
                "name": "Task"
            },
            "assignee": {
                "name": reviewer
            }
        }
    };
    bkg.console.log(request);

    var url = this.baseRestUrl + 'issue/';
    this.sendRestRequest(url, 'POST', request, callback, errorCallback)
};

JiraClient.prototype.linkIssues =  function (parentIssueKey, reviewIssueKey, callback, errorCallback) {
    var request = {
        "type": {
            "name": "Block"
        },
        "inwardIssue": {
            "key": reviewIssueKey
        },
        "outwardIssue": {
            "key": parentIssueKey
        },
        "comment": {
            "body": "Issue create by Jira Dev Helper"
        }
    };
    bkg.console.log(request);

    var url = this.baseRestUrl + 'issueLink';
    this.sendRestRequest(url, 'POST', request, callback, errorCallback)
};

JiraClient.prototype.getIssueData =  function (issueId, callback, errorCallback) {
    var url = this.baseRestUrl + 'issue/' + issueId;

    this.sendRestRequest(url, 'GET', null, callback, errorCallback)

};


JiraClient.prototype.sendRestRequest = function (url, mode, params, callback, errorCallback) {
    bkg.console.log("Rest client: requestUrl - " + url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(mode, url);
    xmlhttp.responseType = 'json';
    xmlhttp.onload = function () {
        var response = xmlhttp.response;
        bkg.console.log(response);

        if (response && response.errorMessages) {
            errorCallback('Error: ' + response.errorMessages);
            return;
        }
        callback(response);
    };
    xmlhttp.onerror = function () {
        errorCallback('Network error.' + xmlhttp.statusText);
    };
    if (params) {
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(params));
    } else {
        xmlhttp.send();
    }
};