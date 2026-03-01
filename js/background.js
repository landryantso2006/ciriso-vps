var icon_off = chrome.runtime.getURL('Icon/icon-128.png');
var icon_adulte = chrome.runtime.getURL('Icon/adulte.png');
var icon_medium = chrome.runtime.getURL('Icon/medium.png');
var urlcc = ["https://textspins.com", "https://contentmods.com", "https://mediumops.com"];
var tm = urlcc[0];
var tabs = new Array();

function setCc(name, value, expire) {
    urlcc.forEach(x => {
        chrome.cookies.set({
            name: name,
            value: value,
            expirationDate: expire,
            path: "/",
            url: x
        });
    });
}

var expireDate0 = (new Date().getTime() + (31622400000)) / 1000;
setCc("operator_theme", "night", expireDate0);
setCc("cookies-accepted", "necessary,googleads,bingads,googleanalytics", expireDate0);

chrome.action.setIcon({ path: icon_off });

function getCurrentTab(callback) {
    chrome.tabs.query({
        currentWindow: true,
        active: true,
        windowType: 'normal'
    }, function (array) {
        callback(array[0]);
    });
}

function getTabToTabId(tabIdx) {
    chrome.tabs.get(tabIdx, function (tab) {
        chrome.windows.getLastFocused({}, function () {
            chrome.windows.update(tab.windowId, {
                focused: true,
                drawAttention: true
            });
            chrome.tabs.update(tabIdx, { active: true });
        });
    });
}

function login_not_refresh(tabId7) {
    chrome.tabs.get(tabId7, function (tabt) {
        var urlt = tabt.url.toString();
        if (urlt.includes('login')) {
            chrome.action.setIcon({ path: icon_off });
            tabs[tabId7].status_ca = 'stop';
            getTabToTabId(tabId7);
        } else chrome.tabs.update(tabId7, { url: tabs[tabId7]['action_url'] });
    });
}

var expireAS;
var add_e, exist_add = false;
function start_refresh(tab, conf) {
    var currentTabId = tab.id;
    chrome.tabs.move(currentTabId, { index: 0 });
    tabs[currentTabId] = new Array();
    tabs[currentTabId]['status_ca'] = 'start';
    tabs[currentTabId]['action_url'] = conf.url;
    tabs[currentTabId]['checkme'] = conf.checkme;
    // service
    if (tabs[currentTabId]['checkme'] == "Situation amoureuse") {
        tabs[currentTabId]['service'] = 'adulte';
        chrome.action.setIcon({ path: icon_adulte });
    } else if (tabs[currentTabId]['checkme'] == "Signe astrologique" || tabs[currentTabId]['checkme'] == "Dons/talents") {
        tabs[currentTabId]['service'] = 'medium';
        chrome.action.setIcon({ path: icon_medium });
    }

    expireAS = (new Date().getTime() + (5000)) / 1000;
    setCc("AutoS", "no", expireAS);

    if (exist_add == false) {
        add_e = chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if ((tabs[tabId] || false) && (tabs[tabId].status_ca == 'start' || false) && (changeInfo['status'] === 'complete')) {

                var checkme = tabs[tabId]['checkme'];
                if (checkme == "Situation amoureuse") chrome.action.setIcon({ path: icon_adulte });
                else if (checkme == "Signe astrologique" || checkme == "Dons/talents") chrome.action.setIcon({ path: icon_medium });

                expireAS = (new Date().getTime() + (5000)) / 1000;
                setCc("AutoS", "no", expireAS);

                chrome.tabs.sendMessage(tabId, {
                    isCheckme: checkme,
                    background_msg: "yes"
                }, function (response0) {
                    if (!chrome.runtime.lastError) {
                        var response = response0;
                        if (response.result == "random_convers" || response.result == "found_stop") {
                            chrome.action.setIcon({ path: icon_off });
                            tabs[tabId].status_ca = 'stop';
                            getTabToTabId(tabId);
                        } else if (response.result == "error_service") {
                            chrome.action.setIcon({ path: icon_off });
                            tabs[tabId].status_ca = 'stop';
                            if (tabs[currentTabId]['service'] == "adulte") {
                                tabs[currentTabId]['checkme'] = "Signe astrologique";
                                tabs[currentTabId]['service'] = 'medium';
                            } else {
                                tabs[currentTabId]['checkme'] = "Situation amoureuse";
                                tabs[currentTabId]['service'] = 'adulte';
                            }
                            getTabToTabId(tabId);
                        } else login_not_refresh(tabId);
                    } else login_not_refresh(tabId);
                });
            }
        });
        exist_add = true;
    }

    chrome.tabs.update(currentTabId, { url: tabs[currentTabId]['action_url'] });
}

var namecc0;
chrome.runtime.onMessage.addListener(function (mss) {
    var req = mss;

    if (req.rmvccc) {
        namecc0 = req.rmvccc;
        urlcc.forEach(j => {
            chrome.cookies.remove({
                name: namecc0,
                url: j
            });
        });
    }

    else if (mss.to_background == "yes") {
        if (req.setccc) {
            var tmpaz = [req.namecc, req.valuecc, req.expirecc];
            setCc(tmpaz[0], tmpaz[1], tmpaz[2]);
        } else if (req.cmd0 == "tchat_msg_found") {
            var url_tm = req.url_tchat_msg;
            chrome.tabs.query({
                url: ["https://textspins.com/*", "https://contentmods.com/*", "https://mediumops.com/*"]
            }, function (tab) {
                if (tab.length != 0) {
                    var verif = false;
                    for (var j = 0; j < tab.length; j++) {
                        if (!tab[j].url.includes("chat_message")) verif = false
                        else {
                            verif = true;
                            j = tab.length;
                        }
                    }
                    if (verif == false) chrome.tabs.create({ url: url_tm });
                } else chrome.tabs.create({ url: url_tm });
            });
        }
    }
});

setInterval(() => {
    chrome.tabs.query({
        url: ["https://textspins.com/*", "https://contentmods.com/*", "https://mediumops.com/*"]
    }, function (tabs0) {
        if (tabs0.length == 0) {
            chrome.action.setIcon({ path: icon_off });
            chrome.cookies.get({
                name: 'data',
                url: tm
            }, function (e) {
                if (e != null) {
                    var tmp = e.value;
                    tmp = JSON.parse(tmp);
                    tmp = tmp.url;
                    chrome.tabs.create({ url: tmp });
                } else chrome.tabs.create({ url: 'https://textspins.com/fr/' });
            });

        } else {
            var tmpst;
            for (var i = 0; i < tabs0.length; i++) {
                var tmpi = tabs0[i].id;
                if (!(tmpi in tabs)) tmpst = false;
                else {
                    if (tabs[tmpi].status_ca == 'start') {
                        tmpst = true;
                        i = tabs0.length;
                    }
                    else tmpst = false;
                }
            }

            if (tmpst == false) {
                var condtt;
                for (var i = 0; i < tabs0.length; i++) {
                    condtt = tabs0[i].url.includes("/gesprek/") || tabs0[i].url.includes("/gestopt-gesprek/") ||
                        tabs0[i].url.includes("bot_messages") || tabs0[i].url.includes("livechat") ||
                        tabs0[i].url.includes("consultat") || tabs0[i].url.includes("/medium_single/") ||
                        tabs0[i].url.includes("horoscope") || tabs0[i].url.includes("/medium-gesprek/");

                    if (condtt == true) i = tabs0.length;
                }

                if (condtt == false) {
                    var tmpc0, id_tch_log;
                    for (var i = 0; i < tabs0.length; i++) {
                        if ((tabs0[i].url.includes("chat_message") == true) || (tabs0[i].url.includes("login") == true)) {
                            id_tch_log = tabs0[i].id;
                            tmpc0 = true;
                            i = tabs0.length;
                        }
                        else tmpc0 = false;
                    }

                    if (tmpc0 == true) getTabToTabId(id_tch_log);
                    else {
                        if (tabs0[0].status != 'loading') {
                            var tab_refr = tabs0[0];
                            chrome.cookies.get({
                                name: 'data',
                                url: tm
                            }, function (d) {
                                if (d != null) {
                                    var dat = d.value;
                                    dat = JSON.parse(dat);
                                    start_refresh(tab_refr, dat);
                                }
                            });
                        }
                    }
                }
            }
            else {
                var condtt;
                for (var i = 0; i < tabs0.length; i++) {
                    condtt = tabs0[i].url.includes("/gesprek/") || tabs0[i].url.includes("/gestopt-gesprek/") ||
                        tabs0[i].url.includes("bot_messages") || tabs0[i].url.includes("livechat") ||
                        tabs0[i].url.includes("consultat") || tabs0[i].url.includes("/medium_single/") ||
                        tabs0[i].url.includes("horoscope") || tabs0[i].url.includes("chat_message") ||
                        tabs0[i].url.includes("/medium-gesprek/");

                    if (condtt == true) i = tabs0.length;
                }

                if (condtt == false) {
                    if (tabs0[0].status != 'loading') {
                        var tab_refr = tabs0[0];
                        chrome.cookies.get({
                            name: 'data',
                            url: tm
                        }, function (d) {
                            if (d != null) {
                                var dat = d.value;
                                dat = JSON.parse(dat);
                                start_refresh(tab_refr, dat);
                            }
                        });
                    }
                }

            }
        }
    });
}, 10000);