var url_loc0 = window.location.toString();

chrome.runtime.onMessage.addListener(function (rqq, sender, sendResponse) {
    if (rqq.background_msg == "yes") {
        var request = rqq;
        var regex1 = new RegExp(request.isCheckme, "i");
        var regex2 = new RegExp("Vous n'avez pas accès", "i");

        function stop(rep, url_include) {
            var btnR = document.getElementsByClassName('btn btn-default') || false;
            if (btnR) {
                var nbrS, urlS, j = 0;
                var array_url = [];
                for (var i = 0; i < btnR.length; i++) {
                    if (btnR[i].innerHTML == rep) {
                        var hrefS = btnR[i].getAttribute('href').toString();
                        if (hrefS.includes(url_include)) {
                            array_url[j] = hrefS;
                            j = j + 1;
                        }
                    }
                }
                nbrS = array_url.length;
                nbrS = Math.floor(Math.random() * nbrS);
                urlS = array_url[nbrS];

                sendResponse({
                    result: "found_stop"
                });

                window.location.replace(urlS);
            } else sendResponse({});
        }

        if (url_loc0.includes('/gesprek/') || url_loc0.includes('/medium_single/') || url_loc0.includes('/medium-gesprek/')) {
            if (regex1.test(document.body.innerHTML))
                sendResponse({
                    result: "random_convers"
                });
        }

        else if (url_loc0.includes('/gestopte-gesprekken')) stop("Réponse", "/gestopt-gesprek/");

        else if (url_loc0.includes('/gestopte-medium-gesprekken')) stop("Répondre", "/medium-gesprek/");

        else if (regex2.test(document.getElementsByClassName('alert')[0].innerHTML))
            sendResponse({
                result: "error_service"
            });

        else sendResponse({});
    }
});