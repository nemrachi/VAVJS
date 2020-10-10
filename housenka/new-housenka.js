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

// "struct" for field coordinates
class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const fieldSize = 48;
const canvasSize = [700, 700];
var fieldPos = []; // fields coordinates on canvas
xsize = ~~(canvasSize[0] / fieldSize); // scaled by canvas size
ysize = ~~(canvasSize[1] / fieldSize); // scaled by canvas size
plocha = []

// new control keys - added w, a, s, d
nastav_smer = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'd', 's', 'a', 'w'];

window.addEventListener("keydown", (e) => {
    if (nastav_smer.indexOf(e.key) >= 0) {
        e.preventDefault(); // disable default behavior of control keys
    }
}, false);

// get images with CC licence from internet
const images = getImages();

// TODO: pridanie debug vypisov v debugovacom mode 1


// TODO: pridanie <canvas> do HTML suboru pouzitim JS funkcii 1
const htmlBody = document.body;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

initCanvas();

function initCanvas() {
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    
    htmlBody.innerHTML = ''; // clears HTML created in https://is.stuba.sk/js/herna/housenka.js
    htmlBody.appendChild(canvas);
}

// TODO: prepisanie iba potrebnych funkcii z AIS kodu 1
function housenkaInit() {
    for (let y = 0; y < ysize; y++) {
        for (let x = 0; x < xsize; x++) {
            let pos = coords(x, y);
            plocha[pos] = 0;
            fieldPos[pos] = new Coordinates(x * fieldSize, y * fieldSize);
        }
    }

    novaHra();
    window.onload = () => startHry();
    document.defaultAction = false;
}

function nastavBarvu(pozice, barva) {
    plocha[pozice] = barva;
    // x and y in canvas grid
    let x = fieldPos[pozice].x;
    let y = fieldPos[pozice].y;

    ctx.drawImage(images[barva], x, y, fieldSize, fieldSize);
}

// TODO: vykreslovanie pohybujucej husenky pomocou JS funkcii 1


// TODO: zmena ovladania husenice 1
function stiskKlavesy(e) {
    let udalost = e || window.event;

    klavesy[udalost.keyCode] = true;

    if (startuj_hru) {
        rozpohybujHousenku();
        startuj_hru = 0;
        show_result(hlaska);
    }

    let obslouzena = false;
    console.log(nastav_smer);
    for (let klavesa = 0; klavesa < nastav_smer.length; klavesa++) {
        if (nastav_smer[klavesa] === udalost.key){
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
    } else if (udalost.keyCode === 'p') {
        obslouzena = true;
        zastavHousenku();
        startuj_hru = 1;
        show_result(pauseMsg);
    }

    return !obslouzena;
}

// TODO: vykreslovanie obrazkov policok pomocou JS funkcii 1


// TODO: dynamicke pouzitie obrazkov z externych zdrojov (http...) 1
function getImages() {
    let tmpImages = [];
    let countLoadedImages = 0;

    for (let i = 0; i < obsahy.length; i++) {
        let image = new Image();

        image.onload = () => { // occurs when image loads
            countLoadedImages++;
            if (countLoadedImages === images.length) {
                housenkaInit();
            }
        };

        switch(obsahy[i]) {
            case 'prazdne':
                image.src = 'https://storage.needpix.com/rsynced_images/plain-white-background.jpg';
                break;
            case 'telicko':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_green_blank.svg/768px-Eo_circle_green_blank.svg.png';
                break;
            case 'zradlo':
                image.src = 'https://cdn.iconscout.com/icon/free/png-64/red-apple-fruit-emoj-symbol-food-30677.png';
                break;
            case 'zed':
                image.src = 'https://cdn.pixabay.com/photo/2016/12/24/23/50/pattern-1929506_1280.png';
                break;
            case 'klic':
                image.src = 'https://cdn.pixabay.com/photo/2017/01/30/23/58/key-2022411_1280.png';
                break;
            case 'dvere':
                image.src = 'https://cdn.pixabay.com/photo/2014/12/21/23/54/door-576282_1280.png';
                break;
            case 'hlavicka':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Eo_circle_blue_blank.svg/768px-Eo_circle_blue_blank.svg.png';
                break;
            default:
                alert("Something is wrong with image loading");
                break;
        }

        tmpImages.push(image);
    }

    return tmpImages;
}




//=================================================================================================
// TODO: udanie zdrojov pouzitych obrazkov a ich licenciu v komentari vo vasej JS kniznici 1

// image: prazdne 
// Author: Stamau123
// name: Color_of_Scheele's_Green
// image: https://upload.wikimedia.org/wikipedia/commons/b/b0/Color_of_Scheele%27s_Green.png
// website: https://commons.wikimedia.org/wiki/File:Color_of_Scheele%27s_Green.png
// license: https://en.wikipedia.org/wiki/Creative_Commons


/* telicko image
* You are free:
*     to share – to copy, distribute and transmit the work
*     to remix – to adapt the work
*
* Under the following conditions:
*     attribution – You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
*     share alike – If you remix, transform, or build upon the material, you must distribute your contributions under the same or compatible license as the original.
* licenses: https://en.wikipedia.org/wiki/Creative_Commons, https://creativecommons.org/licenses/by-sa/4.0/deed.en
* Changes wasn't made.
*/

/* hlavicka image
* You are free:
*     to share – to copy, distribute and transmit the work
*     to remix – to adapt the work
*
* Under the following conditions:
*     attribution – You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
*     share alike – If you remix, transform, or build upon the material, you must distribute your contributions under the same or compatible license as the original.
* licenses: https://en.wikipedia.org/wiki/Creative_Commons, https://creativecommons.org/licenses/by-sa/4.0/deed.en
* Changes wasn't made.
*/

/* zradlo image
* You are free:
*     to share – to copy, distribute and transmit the work
*     to remix – to adapt the work
*
* Under the following conditions:
*     attribution – You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
*     share alike – If you remix, transform, or build upon the material, you must distribute your contributions under the same or compatible license as the original.
* licenses: https://en.wikipedia.org/wiki/Creative_Commons, https://creativecommons.org/licenses/by-sa/4.0/deed.en
* This apple icon is part of apple icons family.
* Changes was't made.
 */

/* zed image
* Zadarmo pre komerčné využitie
* Nevyžaduje sa žiaden príspevok
* license: https://pixabay.com/sk/service/license/
* website: https://pixabay.com/sk/illustrations/vzor-super-mario-pixel-art-blok-1929506/7
* image: https://cdn.pixabay.com/photo/2016/12/24/23/50/pattern-1929506_1280.png
 */



/* klic image
* Zadarmo pre komerčné využitie
* Nevyžaduje sa žiaden príspevok
* license: https://pixabay.com/sk/service/license/
* website: https://pixabay.com/sk/vectors/k%C4%BE%C3%BA%C4%8D-z%C3%A1mok-otvoren%C3%A9-star%C3%BD-ro%C4%8Dn%C3%ADk-2022411/
* image: https://cdn.pixabay.com/photo/2017/01/30/23/58/key-2022411_1280.png
 */

/* dvere image
* Zadarmo pre komerčné využitie
* Nevyžaduje sa žiaden príspevok
* license: https://pixabay.com/sk/service/license/
* website: https://pixabay.com/sk/vectors/dvere-zatvoren%C3%A9-re%C5%A5az-dreven%C3%A9-576282/
* image: https://cdn.pixabay.com/photo/2014/12/21/23/54/door-576282_1280.png
 */