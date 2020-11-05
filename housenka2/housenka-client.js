// posielanie stlaceni klaves na server a ich spracovanie na serveri	1
// vratenie aktualnej plochy hry husenice zo serveru pomocou websocketov a vykreslenie aktualnej plochy husenice cez canvas	1
// vypisovanie aktualneho a najlepsieho skore a levelu zo serveru (per user/session)	1
// umoznenie viacerych nezavislych hier paralelne (aspon 1000)	1
// umoznit ovladanie pomocou tlacitok zobrazenych na stranke (aj z inej session, cez zdielany kod/pin)	1
// na stranke umoznit regitraciu a prihlasenie pouzivatelov (e-mail, meno, heslo)	1
// zdielanie session medzi backendom (server) a frontedom (browser)	1
// serverside ukladanie max skore a levelu pre prihlaseneho pouzivatela (inter session) a neprihlaseneho pouzivatela (in session)	1
// admin rozhranie zobrazujuce tabulku pouzivatelov a aktualnych hier (meno ak je, session, kod/pin) len pre pouzivatela "admin"	1
// import a export CSV udajov pouzivatelov (meno, email, heslo, max score, max level) pre pouzivatela "admin"	1
// zozbrazit zoznam aktualne hranych hier s moznostou sledovania (napr. neprihlaseny bez pinu) pre vsetkych pouzivatelov	1
// leaderboard (#, meno, top score, top level; zotriedenie podla top score)	1
// pridat tlacidla na zapnutie a vypnutie hudobnej stopy na pozadi (standardne vypnuta, uviest licenciu, hudba z externeho zdroju)	1
// umoznit ulozit hru do suboru a nacitat hru zo suboru (i pre neprihlasenych; ciselna reprezentacia pola plochy; body a level 0) 1

// e-mail - unikatny, s overenim tvaru
// heslo - hashed
// prihlasovacie meno - unikatne, iba [a-zA-Z]; nepihlaseny "[N/A]"
// kod -  0000 - 9999

let audioOn; //bool

const sock = new WebSocket('ws://localhost:8080');
let clientId;

WebSocket.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);

    if (data.head === 'connection')
})

