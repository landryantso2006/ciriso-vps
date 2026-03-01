// INIT
var secondes, timeGB;
const timeInitAdulte = 390; //6m30
const timeInitMedium = 480; //8
const timeRed = 120; // 2

var tag_audio_rc = document.createElement('audio');
tag_audio_rc.preload = 'auto';
tag_audio_rc.play = true;
tag_audio_rc.loop = true;
tag_audio_rc.volume = 1;
tag_audio_rc.src = chrome.runtime.getURL("sound/") + 'alert_convers.mp3';
tag_audio_rc.autoplay = true;
document.body.appendChild(tag_audio_rc);

function remove_e_l (){
    tag_audio_rc.pause();
    document.body.removeEventListener('click', function () {
        tag_audio_rc.pause(); 
    });
    document.body.removeEventListener('keydown', function () {
        tag_audio_rc.pause();
    });
}
document.body.addEventListener('click', function () {
    remove_e_l ();
});

document.body.addEventListener('keydown', function () {
    remove_e_l ();
});

// PLATEFORME & SITE
var plateforme, timeInit, site0;
if (url_loc0.includes('medium_single') || url_loc0.includes('medium-gesprek')) {
    plateforme = 'medium';
    timeInit = timeInitMedium;
    timeGB = 420; // 7
} else {
    plateforme = 'adulte';
    timeInit = timeInitAdulte;
    timeGB = 360; // 6
}

if (url_loc0.includes('textspins')) site0 = 'textspins';
else if (url_loc0.includes('contentmods')) site0 = 'contentmods';
else if (url_loc0.includes('mediumops')) site0 = 'mediumops';

// STOP
var is_StopMsg;
var StopMsg_Element = document.querySelectorAll('span[class="pull-right label label-warning"]');
var tmpop = false;

if (plateforme == 'adulte') {
    for (var i = 0; i < StopMsg_Element.length; i++) {
        if (StopMsg_Element[i].innerText == "Stop-conversations") {
            StopMsg_Element[i].style['font-size'] = '100%';
            StopMsg_Element[i].style['color'] = '#fff';
            tmpop = true;
            i = StopMsg_Element.length;
        }
        else tmpop = false;
    }

} else {
    for (var i = 0; i < StopMsg_Element.length; i++) {
        if (StopMsg_Element[i].innerText == "Conversations médiums arrêtées") {
            StopMsg_Element[i].style['font-size'] = '100%';
            StopMsg_Element[i].style['color'] = '#fff';
            tmpop = true;
            i = StopMsg_Element.length;
        }
        else tmpop = false;
    }
}

if (tmpop) is_StopMsg = true;
else is_StopMsg = false;

//TCHAT_MSG
var is_tchat;
if (url_loc0.includes('chat_message')) is_tchat = true;
else is_tchat = false;


//NAME COOCKIE
var nameCoockie_CID;
var namec = url_loc0;
if (plateforme == 'adulte') {
    if (site0 == 'textspins' || site0 == 'mediumops') {
        if (is_StopMsg) namec = namec.slice(41).toString();
        else if (is_tchat) namec = namec.slice(49).toString();
        else namec = namec.slice(33).toString();
    }
    else if (site0 == 'contentmods') {
        if (is_StopMsg) namec = namec.slice(43).toString();
        else if (is_tchat) namec = namec.slice(51).toString();
        else namec = namec.slice(35).toString();
    }
    if (namec.includes('eu-') || namec.includes('na-')) namec = namec.slice(3).toString();
    namec = 'Adt_' + namec;

} else if (plateforme == 'medium') {
    if (site0 == 'textspins' || site0 == 'mediumops') namec = namec.slice(40).toString();
    else if (site0 == 'contentmods') namec = namec.slice(42).toString();
    namec = 'Med_' + namec;
}

if (is_StopMsg) namec = namec + '_Stp';
else if (is_tchat) namec = namec + '_Tchat';
else namec = namec + '_Conv'

nameCoockie_CID = namec;

// FONCTION READCOOKIE
function readCookie(name) {
    var nameEQ = nameCoockie_CID + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// VALEUR INITIALE
var ExistenceCookie = readCookie(window.location);
if (ExistenceCookie) {
    if (ExistenceCookie < timeInit + 1) {
        secondes = readCookie(window.location) - 1;
        if (secondes < 0) {
            chrome.runtime.sendMessage({ "rmvccc": nameCoockie_CID });
            secondes = timeInit;
        }
    } else secondes = timeInit;
} else secondes = timeInit;

// BtnEnvoie && Remove_Cookie  
var reset_timer = 'no';
if (plateforme == 'adulte') {
    if (!is_tchat) {
        var btnEnvoie_Photo = document.getElementsByClassName('btn btn-primary pull-right')[1]; // adulte + sary
    } else {
        var btnEnvoie_Photo = document.getElementsByClassName('btn btn-primary pull-right')[0]; // adulte + sary
    }
    var btnEnvoie = document.getElementsByClassName('btn btn-primary btn-block-xs pull-left rmarg10')[0]; // adulte
    ClicBtnEnv(btnEnvoie);
    ClicBtnEnv(btnEnvoie_Photo);

} else if (plateforme == 'medium') {
    var btnMedium = document.getElementsByClassName('btn btn-primary btn-block-xs')[0]; // medium
    ClicBtnEnv(btnMedium);
}

function ClicBtnEnv(btn) {
    btn.addEventListener("click", function (e) {
        if (reset_timer == 'yes') {
            var ax = 0;
            clearInterval(timerID);
            var tx = setInterval(() => {
                chrome.runtime.sendMessage({ "rmvccc": nameCoockie_CID });
                if (ax > 333) clearInterval(tx);
                ax = ax + 1;
            });
        }
    });
}

// CODE AFFICHAGE HTML
var div_timer = document.createElement('div');
div_timer.id = 'div_timer';
div_timer.style['background-color'] = 'rgb(41, 41, 41)';
div_timer.style['z-index'] = '2147483647';
div_timer.style['position'] = 'fixed';
div_timer.style['height'] = '50px';
if (is_StopMsg == true) div_timer.style['width'] = '213px';
else if (is_tchat == true) div_timer.style['width'] = '233px';
else div_timer.style['width'] = '115px';
div_timer.style['top'] = '0px';
div_timer.style['right'] = '0px';
div_timer.style['filter'] = 'drop-shadow(0 0 0.1rem rgb(255 255 255 / 70%))';
div_timer.style['box-shadow'] = '5px 0px 19px 5px rgb(0 0 0 / 70%)';
div_timer.style['background-image'] = 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(0,0,0,0.3))';
div_timer.style['border-radius'] = '0px 0px 0px 7px';
document.body.appendChild(div_timer);

var span1 = document.createElement('span');
span1.id = 'timer';
style(span1);
span1.style['font-family'] = 'digital';
span1.style['z-index'] = '2147483647';
span1.style['right'] = '10px';
span1.style['top'] = '8px';
var Span1ContentTxt = document.createTextNode(secondes); // affichage TEMPS INITIAL
span1.appendChild(Span1ContentTxt);
document.body.appendChild(span1);

if (is_StopMsg == true) {
    var span2 = document.createElement('span');
    style(span2);
    span2.style['font-family'] = 'digital';
    span2.style['z-index'] = '2147483647';
    span2.style['right'] = '115px';
    span2.style['top'] = '15px';
    span2.style['font-size'] = '41px';
    var Span2ContentTxt = document.createTextNode('Stop ');
    span2.appendChild(Span2ContentTxt);
    document.body.appendChild(span2);
} else if (is_tchat == true) {
    var span2 = document.createElement('span');
    style(span2);
    span2.style['font-family'] = 'digital';
    span2.style['z-index'] = '2147483647';
    span2.style['right'] = '115px';
    span2.style['top'] = '15px';
    span2.style['font-size'] = '41px';
    var Span2ContentTxt = document.createTextNode('Tchat ');
    span2.appendChild(Span2ContentTxt);
    document.body.appendChild(span2);
}

function style(style0) {
    style0.style['font-size'] = '61px';
    style0.style['line-height'] = '0.5';
    style0.style['color'] = 'rgb(255, 255, 255)';
    style0.style['filter'] = 'drop-shadow(0 0 0.2rem rgba(255, 255, 255, 0.7))';
    style0.style['position'] = 'fixed';
}


//VOS_CONVS
var $e_id = id => document.getElementById(id);

var div_conv1 = document.createElement('div');
div_conv1.id = 'div_conv1';
div_conv1.style['background-color'] = '#3f3f3f';
div_conv1.style['z-index'] = '2147483647';
div_conv1.style['display'] = 'none';
div_conv1.style['position'] = 'fixed';
div_conv1.style['bottom'] = '0px';
div_conv1.style['right'] = '0px';
div_conv1.style['border-radius'] = '5px 0px 0px 0px';
document.body.appendChild(div_conv1);

var span_co = document.createElement('span');
span_co.id = 'in_conv';
span_co.style['background'] = 'linear-gradient(.25turn, #000000, #ffffff, #000000)';
span_co.style['bottom'] = '0px';
span_co.style['right'] = '0px';
span_co.style['border'] = '1px solid rgb(255, 0, 0)';
span_co.style['border-right-width'] = '0px';
span_co.style['border-bottom-width'] = '0px';
span_co.style['border-radius'] = '5px 0px 0px 0px';
span_co.style['box-shadow'] = 'rgb(255, 0, 0) 0px 0px 33px';
span_co.style['color'] = 'rgb(0,0,0)';
span_co.style['position'] = 'fixed';
div_conv1.appendChild(span_co);

var badgen = document.createElement('span');
badgen.className = "badge";
badgen.style['position'] = 'fixed';
badgen.style['z-index'] = '2147483647';
badgen.style['width'] = '23px';
badgen.style['height'] = '23px';
badgen.style['font-size'] = '17px';
badgen.style['box-shadow'] = 'black 3px 1px 9px';
badgen.style['text-shadow'] = 'black 3px 1px 7px';
badgen.style['border-radius'] = '5px';
badgen.style['background-color'] = 'rgb(255,0,0)';
badgen.style['color'] = 'white';
div_conv1.appendChild(badgen);


var ouverte = false;
function vos_convs_tchat_msg() {
    if (!is_tchat) {
        var xhr = new XMLHttpRequest();
        var uii;
        if (plateforme == 'adulte') uii = 'https://' + site0 + '.com/fr/conversations';
        else uii = 'https://' + site0 + '.com/fr/medium-gesprekken';
        xhr.open('GET', uii, true);
        xhr.onload = function () {
            var responseData = xhr.responseText;
            var iin = document.getElementById('in_conv');
            iin.innerHTML = responseData;
            iin = document.getElementById('in_conv');

            //tchat_msg
            if (plateforme == "adulte" && ouverte == false) {
                var nbr_row = iin.getElementsByClassName("row convo_overview");
                var res_nvc = true;
                var res_nac = true;

                //nbr_vos_convers
                for (var i = 0; i < nbr_row.length; i++) {
                    var h2 = nbr_row[i].querySelector("h2");
                    if (h2.innerHTML == "Vos conversations") {
                        var nb = nbr_row[i].getElementsByClassName("col-xs-12");
                        if (nb.length < 4) res_nvc = true;
                        else res_nvc = false;
                    }
                }

                // autres conversations
                for (var i = 0; i < nbr_row.length; i++) {
                    var h2 = nbr_row[i].querySelector("h2");
                    if (h2.innerHTML == "Autres conversations") {
                        var nb = nbr_row[i].getElementsByClassName("col-xs-12");
                        if (nb.length == 1) res_nac = true;
                        else res_nac = false;
                    }
                }

                if (res_nvc == true && res_nac == true) {
                    for (var i = 0; i < nbr_row.length; i++) {
                        var h2 = nbr_row[i].querySelector("h2");
                        if (h2.innerHTML == "Tchat messages") {
                            var btn_t = nbr_row[i].querySelectorAll("a.btn.btn-default.btn-block-sm");

                            var nbrS, urlS, j;
                            var array_url = [];
                            j = 0;
                            for (var i = 0; i < btn_t.length; i++) {
                                var hrefS = btn_t[i].getAttribute('href').toString();
                                array_url[j] = hrefS;
                                j = j + 1;
                            }
                            nbrS = array_url.length;
                            nbrS = Math.floor(Math.random() * nbrS);
                            urlS = array_url[nbrS];

                            ouverte = true;
                            chrome.runtime.sendMessage({
                                cmd0: "tchat_msg_found",
                                url_tchat_msg: urlS,
                                to_background: "yes"
                            });
                        }
                    }
                }
            }

            //vos_conversation
            try {
                var tmpw = iin.getElementsByClassName("row convo_overview")[0];
                var tmpwidth;
                var long1 = tmpw.getElementsByClassName("col-xs-12");
                for (var i = 0; i < long1.length; i++) {
                    if (i == 0) {
                        tmpwidth = 30;
                        long1[0].getElementsByTagName('h2')[0].style['text-shadow'] = 'black 0px 0px 3px';
                        long1[0].getElementsByTagName('h2')[0].style['margin'] = '0px';
                        long1[0].getElementsByTagName('h2')[0].style['font-size'] = '21px';
                        long1[0].getElementsByTagName('h2')[0].style['height'] = '30px';
                        long1[0].getElementsByTagName('h2')[0].style['padding-top'] = '3px';
                        long1[0].getElementsByTagName('h2')[0].style['text-align'] = 'center';
                        long1[0].getElementsByTagName('h2')[0].style['background'] = 'rgba(255, 255 ,255, 0.75)';

                    } else {
                        long1[i].getElementsByClassName('panel panel-default')[0].style['background'] = '#242323';
                        long1[i].getElementsByClassName('panel panel-default')[0].style['color'] = 'rgb(251, 251, 251)';
                        long1[i].getElementsByClassName('panel panel-default')[0].style['border-radius'] = '0px';
                        long1[i].getElementsByClassName('panel panel-default')[0].style['margin-bottom'] = '1px';
                        if (plateforme == 'adulte') {
                            tmpwidth = tmpwidth + 99;
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("col-sm-2")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("col-sm-2")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("col-sm-2")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("clearfix")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("clearfix")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("clearfix")[0].remove();
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("reply_btn_container")[0].remove();
                            var long2 = long1[i].getElementsByClassName("row")[0].querySelectorAll('div');

                            long2[0].setAttribute('class', 'col-xs-3');
                            long2[1].setAttribute('class', 'col-xs-3');
                            long2[2].setAttribute('class', 'col-xs-6');
                            long2[3].setAttribute('class', 'col-xs-6');
                            long2[3].style['top'] = '7px';

                            var Hcontent1 = long2[0].innerHTML;
                            var Hcontent2 = long2[1].innerHTML;
                            long2[0].innerHTML = Hcontent2;
                            long2[1].innerHTML = Hcontent1;

                            long2[0].style['width'] = '97px';
                            long2[0].style['padding-right'] = '5px';
                            long2[1].style['padding'] = '0px';
                            long2[1].style['width'] = '77px';
                            long2[2].style['padding-right'] = '0px';
                            long2[2].style['width'] = '240px';
                            long2[2].style['padding-left'] = '5px';
                            long2[3].style['padding-right'] = '0px';
                            long2[3].style['width'] = '240px';
                            long2[3].style['padding-left'] = '5px';
                            long2[2].getElementsByClassName('vl')[0].style['border'] = 'none';
                            long2[3].getElementsByClassName('lb')[0].style['display'] = 'none';
                            long2[3].getElementsByClassName('vl')[0].style['border'] = 'none';
                        } else {
                            tmpwidth = tmpwidth + 40;
                            long1[i].getElementsByClassName("row")[0].getElementsByClassName("reply_btn_container")[0].remove();
                            var long3 = long1[i].getElementsByClassName("row")[0].querySelectorAll('div');
                            for (var j = 0; j < long3.length; j++) {
                                long3[j].setAttribute('class', 'col-xs-6');
                            }
                            long3[0].style['width'] = '240px';
                            long3[0].getElementsByClassName('lb')[0].innerHTML = 'CID : ' + long3[0].getElementsByClassName('vl')[0].innerHTML;
                            long3[0].getElementsByClassName('vl')[0].style['display'] = 'none';

                            long3[0].getElementsByClassName('lb')[0].setAttribute("id", "lang_pays");
                            var localite = document.createElement('span');
                            localite.className = "localite";
                            localite.style['float'] = 'right';
                            localite.style['position'] = 'relative';
                            localite.style['right'] = '10px';
                            long3[0].getElementsByClassName('lb')[0].appendChild(localite);

                            long3[0].getElementsByClassName('localite')[0].innerHTML = long3[2].getElementsByClassName('vl')[0].innerHTML;

                            long3[1].style['width'] = '160px';
                            long3[1].style['padding'] = '0px';
                            long3[1].getElementsByClassName('lb')[0].style['display'] = 'none';
                            long3[1].getElementsByClassName('vl')[0].style['border'] = 'none';

                            long3[2].style['display'] = 'none';
                        }
                    }
                }

                if (plateforme == 'adulte') {
                    div_conv1.style['width'] = '410px';
                    span_co.style['width'] = '410px';
                    badgen.style['right'] = '394px';
                } else {
                    div_conv1.style['width'] = '401px';
                    span_co.style['width'] = '401px';
                    badgen.style['right'] = '385px';
                }

                iin.innerHTML = tmpw.outerHTML;
                div_conv1.style['height'] = tmpwidth + 'px';
                span_co.style['height'] = tmpwidth + 'px';
                badgen.style['bottom'] = (tmpwidth - 17) + 'px';
                document.getElementById('div_conv1').getElementsByClassName('badge')[0].innerHTML = long1.length - 1;

            } catch {
                iin.innerHTML = "";
            }
            div_conv1.style['display'] = 'block';
        };
        xhr.send();
    }
}



//////////////////////////////
var a_logo = document.querySelector('a[class=" logo"]');
a_logo.removeAttribute('href');
a_logo.style['display'] = 'none';
a_logo.innerHTML = "";
a_logo.style['font-size'] = '30px';
a_logo.style['font-weight'] = 'bold';
a_logo.style['color'] = '#ddd';

var span_prod = document.createElement('span');
span_prod.id = 'prod';
span_prod.style['position'] = 'fixed';
span_prod.style['z-index'] = '2147483647';
span_prod.style['top'] = '0px';
span_prod.style['left'] = '0px';

span_prod.style['font-size'] = '30px';
span_prod.style['font-weight'] = 'bold';
span_prod.style['color'] = '#ddd';
span_prod.style['border'] = '1px solid #222';
span_prod.style['border-left'] = '0';
span_prod.style['border-radius'] = '0 7px 7px 0';
span_prod.style['background-image'] = 'linear-gradient(to bottom,#3c3c3c 0,#222 100%)';
document.getElementsByClassName("navbar-header")[0].appendChild(span_prod);

function replace_prod() {
    var xhrp = new XMLHttpRequest();
    xhrp.open('GET', "https://" + site0 + ".com/fr/operators/stats/detailed", true);
    xhrp.onload = function () {
        var responseData = xhrp.responseText;
        a_logo.innerHTML = responseData;
        a_logo = document.querySelector('a[class=" logo"]');

        var prod_env_now, prod_rec_now, prod_stop_env;
        if (plateforme == "adulte") {
            var td = document.getElementsByClassName("text-center-sm");
            function ret_value_adt(ind, selector) {
                var value;
                for (var i = 0; i < td.length; i++) {
                    if (td[i].innerHTML.includes(ind)) {
                        value = td[i].parentNode.querySelectorAll(selector)[0].innerHTML.toString();
                        i = td.length;
                    }
                }
                return value
            }
            prod_env_now = ret_value_adt("Messages adultes envoyés", 'td[data-label=' + '"aujourd' + "'hui" + '"]');
            prod_rec_now = ret_value_adt("Messages adultes entrants", 'td[data-label=' + '"aujourd' + "'hui" + '"]');
            prod_stop_env = ret_value_adt("Stop-messages adultes envoyés", 'td[data-label=' + '"aujourd' + "'hui" + '"]');

        } else {
            var td = document.getElementsByClassName("text-center-sm");
            function ret_value_med(ind, selector) {
                var value;
                for (var i = 0; i < td.length; i++) {
                    if (td[i].innerHTML.includes(ind)) {
                        value = td[i].parentNode.querySelectorAll(selector)[0].innerHTML.toString();
                        i = td.length;
                    }
                }
                return value
            }
            prod_env_now = ret_value_med("Messages médium envoyés", 'td[data-label=' + '"aujourd' + "'hui" + '"]');
            prod_rec_now = ret_value_med("Messages médiums entrants", 'td[data-label=' + '"aujourd' + "'hui" + '"]');
            prod_stop_env = ret_value_med("Stop-messages médium envoyés", 'td[data-label=' + '"aujourd' + "'hui" + '"]');

        }

        var nn = document.getElementById("prod");
        a_logo.innerHTML = nn.innerHTML = "&ensp;" + prod_env_now + " | " + prod_rec_now + " | " + prod_stop_env + "&ensp;";

        a_logo.style['display'] = 'block';
        a_logo.style['visibility'] = 'hidden';
        span_prod.style['width'] = a_logo.style['width'];
        span_prod.style['height'] = a_logo.style['height'];
    };
    xhrp.send();
}
replace_prod();



// FONCTION TIMER
var $tm = id => document.getElementById(id);
var vert_bleu, rouge;

var timerID = setInterval(function () {
    secondes -= 1;

    if (secondes > timeGB) {
        if (plateforme == "adulte") $tm('div_timer').style['background-color'] = 'rgb(00, 255, 00)';
        else $tm('div_timer').style['background-color'] = 'rgb(00, 00, 255)';

    } else if (secondes < timeGB && secondes > timeRed) {
        vert_bleu = ((secondes - timeRed) * 255) / (timeGB - timeRed);
        vert_bleu = Math.floor(vert_bleu);
        rouge = ((timeGB - secondes) * 255) / (timeGB - timeRed);
        rouge = Math.floor(rouge);
        if (plateforme == "adulte") $tm('div_timer').style['background-color'] = 'rgb(' + rouge + ', ' + vert_bleu + ', 00)';
        else $tm('div_timer').style['background-color'] = 'rgb(' + rouge + ', 00, ' + vert_bleu + ')';

    } else if (secondes < timeRed) {
        if (secondes < 0) {
            clearInterval(timerID);
            chrome.runtime.sendMessage({ "rmvccc": nameCoockie_CID });
            window.location.replace("https://" + site0 + ".com/fr/deconnexion");
            secondes = timeInit;
            return
        }
        var elementStyle;
        $tm('div_timer').style['background-image'] = 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1))';

        if (document.querySelector('link[href="' + chrome.runtime.getURL("css/") + 'hurry_up.css') == undefined) {
            var head = document.getElementsByTagName('HEAD')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = chrome.runtime.getURL("css/") + 'hurry_up.css';
            head.appendChild(link);
        } 
    }

    var datec = (new Date().getTime() + (150000)) / 1000;
    secondes = secondes.toString();
    chrome.runtime.sendMessage({
        setccc: "scc",
        namecc: nameCoockie_CID,
        valuecc: secondes,
        expirecc: datec,
        to_background: "yes"
    });

    var expireAS4 = (new Date().getTime() + (10000)) / 1000;//Time_AutoS
    chrome.runtime.sendMessage({
        setccc: "scc",
        namecc: "AutoS",
        valuecc: "no",
        expirecc: expireAS4,
        to_background: "yes"
    });

    if (secondes >= 100) $tm('timer').innerText = secondes;
    else if (secondes < 100 && secondes >= 10) $tm('timer').innerText = "0" + secondes;
    else if (secondes < 9) $tm('timer').innerText = "00" + secondes;

    //adulte + medium
    if (plateforme == 'adulte') {
        var current_char_number = document.getElementsByClassName('current_char_number')[0];
        current_char_number = Number(current_char_number.innerHTML);
        var min_message_characters = document.getElementById('min_message_characters');
        min_message_characters = Number(min_message_characters.innerHTML);


        if (is_tchat == true || is_StopMsg == true) {
            if (current_char_number > 119 && min_message_characters == 0) reset_timer = 'yes';
        } else {
            var pourcentageAdulte = document.getElementsByClassName('operator_message_length_percentage')[0] || false;
            if (pourcentageAdulte) {
                if (pourcentageAdulte.hasAttribute('style')) pourcentageAdulte = pourcentageAdulte.getAttribute('style').toString();
                else pourcentageAdulte = '';
            } else pourcentageAdulte = '';

            if (pourcentageAdulte.includes('rgb') && current_char_number > 119 && min_message_characters == 0) reset_timer = 'yes';
        }


    } else if (plateforme == 'medium') {
        var min_message_characters = document.getElementById('min_message_characters');
        min_message_characters = Number(min_message_characters.innerHTML);
        if (min_message_characters == 0) reset_timer = 'yes';
    }

    //notification_vos_conversation
    if (secondes % 10 == 0) {
        vos_convs_tchat_msg();
        replace_prod();
    } else {
        if (secondes % 10 == 9 || secondes % 10 == 8 || secondes % 10 == 7 || secondes % 10 == 6 || secondes % 10 == 5) div_conv1.style['display'] = 'block';
        else div_conv1.style['display'] = 'none';
    }
}, 1000);