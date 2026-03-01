if (!(url_loc0.includes('login'))) {
    var pf, service, ss, cc, uu;
    if (url_loc0.includes('textspins')) pf = 'textspins';
    else if (url_loc0.includes('contentmods')) pf = 'contentmods';
    else if (url_loc0.includes('mediumops')) pf = 'mediumops';
    var search = new RegExp("Conversations Médium", "i");
    if (search.test(document.getElementsByClassName('row navbar-inverse bmarg20')[0].innerHTML)) service = "medium";
    else service = "adulte";
    if (service == 'adulte') {
        ss = 'https://' + pf + '.com/fr/random-gesprek';
        cc = 'Situation amoureuse';
    } else {
        ss = 'https://' + pf + '.com/fr/random-medium-gesprek';
        cc = 'Signe astrologique';
    }
    var data = {
        url: ss,
        checkme: cc
    };
    data = JSON.stringify(data);
    var expireDate0 = (new Date().getTime() + (31622400000)) / 1000;
    chrome.runtime.sendMessage({
        setccc: "scc",
        namecc: "data",
        valuecc: data,
        expirecc: expireDate0,
        to_background: "yes"
    });
}

/////

if (!(url_loc0.includes('/dashboard'))) {
    var div_zoom = document.createElement('div');
    div_zoom.id = 'div_z';
    div_zoom.style['display'] = 'none';
    div_zoom.style['z-index'] = '2147483645';
    div_zoom.style['position'] = 'fixed';
    document.body.appendChild(div_zoom);

    var img_zoom = document.createElement('img');
    img_zoom.id = 'img_z';
    img_zoom.style['background'] = 'padding-box padding-box rgb(255, 255, 255)';
    img_zoom.style['margin'] = '7px';
    img_zoom.style['border'] = '1px solid rgb(255, 255, 255)';
    img_zoom.style['border-radius'] = '7px';
    img_zoom.style['box-shadow'] = 'rgb(255, 255, 255) 0px 0px 33px';
    img_zoom.style['position'] = 'relative';
    img_zoom.style['width'] = 'auto';
    img_zoom.style['height'] = 'auto';
    div_zoom.appendChild(img_zoom);

    var e_img = document.getElementById('img_z');
    document.body.addEventListener('mousemove', function (e) {
        position_taille_zPlus(e);
    });

    function position_taille_zPlus(e) {
        var e_img = document.getElementById('img_z');
        var width_s = e_img.offsetWidth;
        var height_s = e_img.offsetHeight;
        if ((window.innerWidth - e.clientX - 33) > width_s) div_zoom.style['left'] = (e.clientX + 8) + 'px';
        else {
            if (width_s > e.clientX) {
                div_zoom.style['width'] = (e.clientX - 16) + 'px';
                div_zoom.style['left'] = '0px';
            } else {
                div_zoom.style['left'] = (e.clientX - width_s - 16) + 'px';
            }
        }
        if ((window.innerHeight - e.clientY - 24) > height_s) div_zoom.style['top'] = (e.clientY + 8) + 'px';
        else div_zoom.style['top'] = (window.innerHeight - height_s - 16) + 'px';

        img_z.style['max-width'] = (window.innerWidth - 27) + 'px';
        img_z.style['max-height'] = (window.innerHeight - 16) + 'px';
        if (window.innerWidth < width_s) div_zoom.style['width'] = window.innerWidth + 'px';
        if (window.innerHeight < height_s) div_zoom.style['height'] = window.innerHeight + 'px';
    }

    var inject_img = document.images;
    var url_img = [];
    var url_img1, e_parent_img;
    for (var i = 0; i < inject_img.length; i++) {
        e_parent_img = inject_img[i].parentNode;
        if (e_parent_img.hasAttribute('title')) e_parent_img.removeAttribute('title');
        if (e_parent_img.hasAttribute('href')) {
            if (!e_parent_img.getAttribute('href').includes('dashboard') && !e_parent_img.getAttribute('href').includes('no_ava')) {
                inject_img[i].style['border-radius'] = '7px';
                url_img[i] = e_parent_img.getAttribute('href');

                inject_img[i].addEventListener('mouseover', function (e) {
                    var e_img = document.getElementById('img_z');
                    this.style['border'] = '2px solid rgb(255, 0, 0)';
                    this.style['box-shadow'] = 'rgb(255, 0, 0) 0px 0px 33px';
                    div_zoom.style['display'] = 'block';
                    url_img1 = this.parentNode.getAttribute('href');
                    e_img.setAttribute('src', url_img1);
                    e_img.addEventListener('load', function () {
                        position_taille_zPlus(e);
                    });
                });

                inject_img[i].addEventListener('mouseout', function (b) {
                    var parent = this;
                    var ii = document.getElementById('img_z');
                    var dd = document.getElementById('div_z');
                    if (b.toElement.id == 'img_z') {
                        dd.addEventListener('mouseout', function (n) {
                            parent.style['border'] = 'none';
                            parent.style['box-shadow'] = 'none';
                            dd.style['display'] = 'none';
                            ii.removeAttribute('src');
                        });
                        dd.addEventListener('click', function (n) {
                            parent.style['border'] = 'none';
                            parent.style['box-shadow'] = 'none';
                            dd.style['display'] = 'none';
                            ii.removeAttribute('src');
                        });
                    } else {
                        parent.style['border'] = 'none';
                        parent.style['box-shadow'] = 'none';
                        dd.style['display'] = 'none';
                        ii.removeAttribute('src');
                    }
                });
            }
        }
    }
}