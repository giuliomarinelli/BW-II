// Funzione di utilità per la creazione di stringhe di query URL
import defaultExport from './secret.js'
function queryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURI(key)}=${encodeURI(params[key])}`)
        .join('&');
}

// URL di redirect e credenziali dell'app Spotify
var redirect_uri = 'http://127.0.0.1:5500/app.html';
var client_id = 'a08665dce25b4dd4b88d1d5a503b023e';
var client_secret = defaultExport;

// Gestione del callback nel browser
async function handleCallback() {
    var code = new URLSearchParams(window.location.search).get('code');
    var state = new URLSearchParams(window.location.search).get('state');


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

    if (!readCookie('SpotifyBearer')) {
        const res = await fetch('https://accounts.spotify.com/api/token', authOptions)
        const data = await res.json();
        console.log(data)
        writeCookie('SpotifyBearer', data.access_token);

    }

    const currentUrl = window.location.href;
    setTimeout(
        () => {
            if (!readCookie('loaded')) {
                writeCookie('loaded', 'loaded')
                window.location.href = currentUrl;
            }
        }
        , 100
    )


    document.addEventListener('DOMContentLoaded', () => {
        function getTemplate(i) {
            const temp = document.getElementsByTagName("template")[i];
            return temp.content.cloneNode(true);
        }

        const clone = getTemplate(0);
        document.getElementById('wrapper').append(clone)
        const api = async () => {


            const options = {
                headers: {
                    'Authorization': `Bearer ${readCookie('SpotifyBearer')}`
                }
            }

            const res1 = await fetch('https://api.spotify.com/v1/me', options);
            const data1 = await res1.json();
            console.log(data1)
            document.getElementById('username').innerText = data1.display_name;
            const res2 = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=30', options);
            const data2 = await res2.json();
            console.log(data2)
            data2.items.forEach(el => {
                const a = document.createElement('a');
                a.classList.add('playlist-list-item', 'd-block', 'mb-2')
                a.innerText = el.name;
                a.href = '#'
                document.querySelector('.playlist-list').append(a);
            })
            const res3 = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=18', options);
            const data3 = await res3.json();
            console.log(data3)
            document.querySelectorAll('.recently-played-item').forEach((el, ind) => {
                el.querySelector('p').innerText = data3.items[ind].name;
                el.querySelector('img').src = data3.items[ind].album.images[1].url;
            })

            const res4 = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=5', options)
            const data4 = await res4.json()
            console.log(data4)
            document.querySelectorAll('.suggested-card').forEach((el, ind) => {
                el.querySelector('.card-img-top').src = data4.artists.items[ind].images[1].url;
                el.querySelector('p').innerText = data4.artists.items[ind].name;
            })
        }
        api()
    })
}


// Chiamare la funzione di gestione del callback al caricamento della pagina

handleCallback()








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

