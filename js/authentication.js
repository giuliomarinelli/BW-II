// Funzione di utilità per la creazione di stringhe di query URL




import defaultExport from './secret.js'
function queryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURI(key)}=${encodeURI(params[key])}`)
        .join('&');
}

// URL di redirect e credenziali dell'app Spotify
var redirect_uri = 'http://127.0.0.1:5500/auth.html';
var client_id = 'a08665dce25b4dd4b88d1d5a503b023e';
var client_secret = defaultExport;


// Gestione del callback nel browser
async function handleCallback() {
    var code = new URLSearchParams(window.location.search).get('code');
    var state = new URLSearchParams(window.location.search).get('state');
    console.log('ciao')

    var authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: queryString({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        })
    };

    //let options;
    // Effettua la richiesta di token

    
        const res = await fetch('https://accounts.spotify.com/api/token', authOptions)
        const data = await res.json();
        writeCookie('SpotifyBearer', data.access_token);
        console.log(data)
        console.log('ciao')
        window.location.href = `./app.html`;
    
}

handleCallback()
console.log('ciao')

function writeCookie(nomecookie, testo) {
    let now = new Date();//Date crea un oggetto data contenente data ed ora attuali
    //now.getMonth()//il mese attuale
    now.setHours(now.getHours() + 1);//Alla data attuale aggiungo un'ora

    let scadenza = "expires=" + now.toUTCString();//converto la data nel formato utc, richiesto per il corretto funzionamento del cookie. esempio: Wed, 14 Jun 2017 07:00:00 GMT

    document.cookie = `${nomecookie}=${testo};${scadenza}`;
}

function readCookie(cookieDaLeggere) {
    let allCookies = document.cookie;


    // Dividiamo i cookies in un array di elementi chiave/valore
    let arr = allCookies.split('; ');//["cookie_sessione=test", "nome=Michele", "mostra_popup=no"]

    let chiave, valore;


    let res = '';
    for (let i = 0; i < arr.length; i++) {

        chiave = arr[i].split('=')[0];//"mostra_popup"
        valore = arr[i].split('=')[1];//"no"
        if (cookieDaLeggere == chiave) {
            res = valore;
        }

    }
    return res;
}

