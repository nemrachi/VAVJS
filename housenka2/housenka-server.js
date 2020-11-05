// Ema Richnakova

// this function is from Milan Sorm https://is.stuba.sk/js/herna/housenka.js​​​​​​​

// TODO: prepisanie hlavnej logiky hry husenica z AIS na server-side riesenie 1

// "struct" for field coordinates
class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// game area variables
const fieldSize = 48;
const canvasSize = [700, 700];
var fieldPos = []; // array of fields coordinates on canvas
xsize = ~~(canvasSize[0] / fieldSize); // scaled by canvas size 
ysize = ~~(canvasSize[1] / fieldSize); // scaled by canvas size
let plocha = [] // because of changed xsize, ysize

// new control keys - added w, a, s, d
nastav_smer = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'd', 's', 'a', 'w'];
window.addEventListener("keydown", (e) => {
    if (nastav_smer.indexOf(e.key) >= 0) {
        e.preventDefault(); // disable default behavior of control keys
    }
}, false);

let sessions = new Map();
let currSession;
let fieldForUser = [];

// get images with CC licence from internet - sources are at the bottom of the code
const images = getImages();

const DEBUG = false;

const htmlBody = document.body;

function makeCurrSession(session) {
    currSession = session;

    if (sessions.has(session)) {
        return
    }

    sessions.set(session, {});
}

function novaHra() {
	vymazHousenku();
	vymazPlochu();

    currSession.klicu = 0;
	currSession.bodu_za_zradlo = bodu_za_zradlo_orig;
	currSession.ulozeno_na_klice = 0;
	currSession.klic_na_scene = false;
	currSession.dvere_na_scene = false;

	var informace = vygenerujLevel();

	currSession.smer = informace[0];
	var x = informace[1];
	var y = informace[2];

	var kam = (currSession.smer + 2) % idx_smeru.length;
	var p = idx_smeru[kam];
	var prdylka_x = x + smery[p];
	var prdylka_y = y + smery[p+1];

	narustHousenky(coords(prdylka_x,prdylka_y),false);
	narustHousenky(coords(x,y),true);

	doplnZradlo(zradlo_pocatek,-1);

    window.onload = () => { startHry() };
    document.defaultAction = false;
}

function vymazHousenku() {
    while (currSession.telicko.length > 0) {
        nastavBarvu(currSession.telicko.pop(), 0);
    }
}

function vymazPlochu() {
    for (currSession.plocha.length; i++) {
        nastavBarvu(i, 0);
    }
}

function nastavBarvu(pozice, barva) {
    currSession.plocha[pozice] = barva;
    fieldForUser.push([pozice, barva]);
}

function narustHousenky(pozice, hlavicka) {
    currSession.telicko.unshift(pozice);
	if (hlavicka) {
        nastavBarvu(pozice,6);
    } else {
        nastavBarvu(pozice,1);
    }
}

function doplnZradlo(kolik, nesmi_byt) {
    for (let i = 0; i < kolik; i++) {
        let pole = volnePole(nesmi_byt);

        nastavBarvu(coords(pole[0], pole[1]), 2);
        currSession.zradla_k_dispozici = currSession.zradla_k_dispozici + 1;
    }
}

function pohybHousenky () {
    let smer_x = smery[Number(idx_smeru[smer])];
    let smer_y = smery[Number(idx_smeru[smer])+1];

    let hlavicka = reverse_coords(telicko[0]);

    smer_x += hlavicka[0];
    smer_y += hlavicka[1];

    if (smer_x >= xsize) smer_x -= xsize;
    if (smer_y >= ysize) smer_y -= ysize;
    if (smer_x < 0) smer_x += xsize;
    if (smer_y < 0) smer_y += ysize;

    let narust = 0;
    let nova_pozice = coords(smer_x, smer_y);
    if (plocha[nova_pozice] == 2) { // zradlo
        body += bodu_za_zradlo;
        ++ulozeno_na_klice;
        show_body();
        vyresKlice(nova_pozice);
        --zradla_k_dispozici;
        ++narust;
        nastavBarvu(nova_pozice,0);
        if (DEBUG) {
            console.log('Food eaten');
        }
    } else if (plocha[nova_pozice] == 4) { // klic
        ++klicu;  
        show_klice();
        klic_na_scene = false;
        nastavBarvu(nova_pozice,0);

        body += bodu_za_klic;
        show_body();

        ++narust;

        if (klicu == klicu_v_levelu) {
            vygenerujDvere(nova_pozice);
        } else {
            vyresKlice(nova_pozice);
        }
        if (DEBUG) {
            console.log('Key taken');
        }
    } else if (plocha[nova_pozice] == 5) { // dvere
        dalsiLevel();
        return;
    }

    if (plocha[nova_pozice] == 0) {
        odbarviHlavu();
        narustHousenky(nova_pozice,true);
        povolena_zmena_smeru = 1;
        if (!narust) nastavBarvu(telicko.pop(),0);
        rozpohybujHousenku();
    } else {
        if (plocha[nova_pozice] == 1) koncime('worm');
        else koncime('wall');
    }
}

function vygenerujDvere (nesmi_byt) {
    let pole = volnePole(nesmi_byt);

    dvere_na_scene = true;
    nastavBarvu(coords(pole[0],pole[1]),5);
    doplnZradlo(zradlo_za_klic,nesmi_byt);

    show_result(doorMsg);

    if (DEBUG) {
        console.log('Door generated');
    }
}

function dalsiLevel () {
    ++level;
    body += level*bodu_za_level;
    body_na_zacatku_levelu = body;

    zradlo_za_klic += navysit_zradlo_za_klic;

    hlaska = nextLevelMsg;
    novaHra();
    show_result(hlaska);

    startuj_hru = 1;

    if (DEBUG) {
        console.log('New level opened');
    }
}

function stiskKlavesy(e) {
    let udalost = e || window.event;

    klavesy[udalost.key] = true;

    if (startuj_hru) {
        rozpohybujHousenku();
        startuj_hru = 0;
        show_result(hlaska);
    }

    let obslouzena = false;
    for (let klavesa = 0; klavesa < nastav_smer.length; klavesa++) {
        if (nastav_smer[klavesa].toLowerCase() === udalost.key.toLowerCase()){
            if (smer % 2 != klavesa % 2 && povolena_zmena_smeru) {
                if (klavesa > 3) { // because of w, a, s, d
                    klavesa = klavesa - 4;
                }

                smer = klavesa;
                povolena_zmena_smeru = 0;
            }
            obslouzena = true
        }
    }

    if (udalost.key === 'Escape') {
        obslouzena = true;
        zastavHru('user');
    } else if (udalost.key.toLowerCase() === 'p') {
        obslouzena = true;
        zastavHousenku();
        startuj_hru = 1;
    }

    return !obslouzena;
}

function getImages() {
    let tmpImages = [];
    let countLoadedImages = 0;

    for (let i = 0; i < obsahy.length; i++) {
        let image = new Image();

        // checks if all images are loaded
        image.onload = () => { // occurs when image loads
            countLoadedImages++;
            if (countLoadedImages === images.length) {
                novaHra();
            }
        };

        switch(obsahy[i]) {
            case 'prazdne':
                image.src = './ground.jpg';
                break;
            case 'telicko':
                image.src = './telicko.png';
                break;
            case 'zradlo':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Leaf.png';
                break;
            case 'zed':
                image.src = 'https://storage.needpix.com/rsynced_images/stones-pattern.jpg';
                break;
            case 'klic':
                image.src = 'https://static.thenounproject.com/png/245610-200.png';
                break;
            case 'dvere':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/240px-Black_hole_-_Messier_87_crop_max_res.jpg';
                break;
            case 'hlavicka':
                image.src = './hlavicka.png';
                break;
            default:
                alert("Something is wrong with obsahy");
                break;
        }

        tmpImages.push(image);
    }

    return tmpImages;
}


// defined messages
var klic24Msg = "kľúče";
var ajaxErrorMsg = "Bohužiaľ Váš prehliadač nedokázal na server odoslať dáta cez AJAX, kontaktujte, prosím, prevádzkovateľa systému.";
var live24Msg = "životy";
var klic5Msg = "kľúčov";
var point5Msg = "bodov";
var waitMsg = "Čakajte, prosím, komunikujem so serverom...";
var klic1Msg = "kľúč";
var bludisteMsg = "bludisko";
var accelMsg = "Húsenica prešla už všetkými bludiskami, ktoré sme pre ňu pripravili. Tak to teraz skúsime trochu rýchlejšie, nie?";
var nextLevelMsg = "Húsenica našla cestu do ďalšieho bludiska, ktoré je však oveľa ťažšie. Húsenicu rozbehnete stlačením kurzorovej klávesy.";
var live5Msg = "životov";
var point1Msg = "bod";
var wormFailMsg = "Húsenica nemôže jesť sama seba, našťastie ale máte ďalší život (vraciate sa na začiatok tohto bludiska).";
var keyGotMsg = "Húsenica si naložila kľúč na seba, teraz musí opäť zbierať potravu a&nbsp;zosilnieť, aby uniesla ďalší kľúč.";
var startGameMsg = "Húsenica sa rozbehne stlačením ľubovoľnej kurzorovej klávesy...";
var papejMsg = "Húsenica potrebuje potravu, aby pekne rástla a&nbsp;mohla nájsť kľúče k&nbsp;dverám do ďalšieho bludiska.";
var keyAppearMsg = "Húsenica je dosť silná na zoberanie jedného z&nbsp;kľúčov od dverí k&nbsp;ďalšiemu bludisku, rýchlo pre neho.";
var wallFailMsg = "Náraz do steny húsenicu dosť bolí, našťastie ale máte ďalší život (vraciate sa na začiatok tohto bludiska).";
var point24Msg = "body";
var doorMsg = "Húsenica má už všetky kľúče od dverí do ďalšieho bludiska, ponáhľajme sa teda k&nbsp;nim.";
var live1Msg = "život";
var pauseMsg = "Húsenica chvíľu odpočíva, rozbehnete ju opäť stlačením kurzorovej klávesy.";


//=================================================================================================
// image: prazdne 
// image ground.jpg is resized by me
// original:
// Author: pxfuel
// name: seamless-tileable-texture-ground.jpg
// image: https://p1.pxfuel.com/preview/71/649/176/seamless-tileable-texture-ground.jpg
// website: https://www.pxfuel.com/en/free-photo-orgvi
// license: Free for commercial use
// comment: image is saved in this folder and is resized


// image: telicko
// image telicko.png is edited by me
// original:
// Author: Gilles San Martin
// name: Bicyclus anynana caterpillar
// original image: https://live.staticflickr.com/5138/5396295472_10591db038_c.jpg
// website: https://www.flickr.com/photos/sanmartin/5396295472/in/photostream/
// license: https://creativecommons.org/licenses/by-sa/2.0/


// image: zradlo 
// original:
// Author: Vzb83
// name: leaf.png
// original image: https://upload.wikimedia.org/wikipedia/commons/a/a8/Leaf.png
// website: https://commons.wikimedia.org/wiki/File:Leaf.png
// license: https://creativecommons.org/licenses/by-sa/3.0/deed.en


// image: zed 
// original:
// Author: Piotr Siedlecki
// name: stones-pattern.jpg
// original image: https://storage.needpix.com/rsynced_images/stones-pattern.jpg
// website: https://www.needpix.com/photo/1481996/grey-background-images-stones-pattern-backdrop-texture-stones-pattern-free-pictures
// license: https://creativecommons.org/licenses/by-sa/3.0/deed.en


// image: klic 
// original:
// Author: Frank Ameka
// name: Tech Leaf 
// original image: https://static.thenounproject.com/png/245610-200.png
// website: https://thenounproject.com/term/tech-leaf/245610/
// license: https://creativecommons.org/licenses/by/3.0/us/legalcode


// image: dvere 
// original:
// Author: European Southern Observatory
// name: Black hole - Messier 87 crop max res.jpg
// original image: https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/240px-Black_hole_-_Messier_87_crop_max_res.jpg
// website: https://commons.wikimedia.org/wiki/File:Black_hole_-_Messier_87_crop_max_res.jpg
// license: https://creativecommons.org/licenses/by/4.0/deed.en


// image: hlavicka 
// image hlavicka.png is edited by me
// original:
// Author: Gilles San Martin
// name: Caterpilar head (Bicyclus anynana)
// original image: https://live.staticflickr.com/5042/5361537264_3986d7fe3c_c.jpg
// website: https://www.flickr.com/photos/sanmartin/5361537264/in/photostream/
// license: https://creativecommons.org/licenses/by-sa/2.0/