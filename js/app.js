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
let device_id;

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
            const tempplate = document.getElementsByTagName("template")[i];
            return tempplate.content.firstElementChild.cloneNode(true);
        }

        const clone = getTemplate(0);
        document.getElementById('append-wrapper').append(clone)
        const api = async () => {

            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = 'BQBCtzY-PDn2Z6yAR3hZ7iamyGqv8lIumryVaO1lh4bJ-89Mi1AakSk-4vfqr8Vk70oDRJM94wV6gYx9tL9FiJt1ybpMiDsSUoXM4dCXcCYpWLnU2sXoHyYr3uWuQ5lvsUy0NKiYx2V9eJaqpdM9W3557-rjnlZA8OMJDl7p7uOtWmOb9TeAsYpy0XGhzpeB6cXZKprBdRDkUqxloQ'
                const player = new Spotify.Player({
                    name: 'Spotify Clone',  
                    getOAuthToken: cb => { cb(token); },
                    volume: 0.5
                });
                player.connect();
                // Ready
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                });
    
                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });
                player.addListener('initialization_error', ({ message }) => {
                    console.error(message);
                });
    
                player.addListener('authentication_error', ({ message }) => {
                    console.error(message);
                });
    
                player.addListener('account_error', ({ message }) => {
                    console.error(message);
                });
                
                console.log(document.getElementById('playToggle'))
                document.getElementById('playToggle').onclick = function () {
                    console.log('click')
                    player.togglePlay();
                };
    
                player.getCurrentState().then(state => {
                    console.log(state)
                    if (!state) {
                        console.error('User is not playing music through the Web Playback SDK');
                        return;
                    }
    
                    var current_track = state.track_window.current_track;
                    var next_track = state.track_window.next_tracks[0];
    
                    console.log('Currently Playing', current_track);
                    console.log('Playing Next', next_track);
                });
    
                fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + readCookie('SpotifyBearer'),
                    },
                    body: JSON.stringify({
                        uris: ["spotify:track:1pfOZQDapYAnR5qbHZhsXm"],
                        device_id: device_id
                    })
                })
                    .then(response => {
                        console.log('ciao')
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                    
            }
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
                a.classList.add('playlist-list-item', 'd-block', 'mb-2', 'album-link', 'album-link')
                a.innerText = el.name;
                a.href = '#'
                a.setAttribute('data-id', el.album.id)
                document.querySelector('.playlist-list').append(a);
            })
            const res3 = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=6', options);
            const data3 = await res3.json();
            console.log(data3)
            document.querySelectorAll('.top-songs').forEach((el, ind) => {
                const a = document.createElement('a');
                a.innerText = data3.items[ind].name;
                a.href = '#'
                a.classList.add('album-link')
                a.setAttribute('data-id', data3.items[ind].id)
                el.querySelector('p').innerText = '';
                el.querySelector('p').append(a);
                el.querySelector('img').src = data3.items[ind].album.images[1].url;
            })

            const res4 = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=5', options)
            const data4 = await res4.json()
            console.log(data4)
            document.querySelectorAll('.suggested-card').forEach((el, ind) => {
                el.querySelector('.card-img-top').src = data4.artists.items[ind].images[1].url;
                const a = document.createElement('a');
                a.href = '#'
                a.classList.add('artist-link')
                a.innerText = data4.artists.items[ind].name;
                a.setAttribute('data-id', data4.artists.items[ind].id)
                el.querySelector('h5').innerText = ''
                el.querySelector('h5').append(a);
                el.querySelector('p').innerText = ''
            })
            const res5 = await fetch('https://api.spotify.com/v1/me/player/devices', options);
            const data5 = await res5.json();
            console.log(data5)
            device_id = data5.devices[0].id;
            console.log(device_id)
            document.querySelectorAll('.album-link').forEach(el => el.addEventListener('click', async (e) => {
                e.preventDefault()
                document.getElementById('username').innerText = data1.display_name;
                const clone = getTemplate(1);
                document.getElementById('content').remove()
                document.getElementById('append-wrapper').append(clone)
                console.log(`https://api.spotify.com/v1/albums/${el.getAttribute('data-id')}`)
                const res6 = await fetch(`https://api.spotify.com/v1/albums/${el.getAttribute('data-id')}`, options)
                const data6 = await res6.json()
                console.log(data6)
                let artists = '';
                data6.artists.forEach(el => artists += el.name + ' ')
                document.getElementById('artist-link').innerText = artists; 
                document.getElementById('total-tracks').innerText = data6.total_tracks; 
                document.getElementById('album-name').innerText = data6.name; 
                document.getElementById('album-img').src = data6.images[1].url; 

            }))
            document.getElementById('home').addEventListener('click', (e) => {
                e.preventDefault()
                const clone = getTemplate(0);
                document.getElementById('content').remove()
                document.getElementById('append-wrapper').append(clone)
                api()
            })
        }
        api();
        
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = 'BQBCtzY-PDn2Z6yAR3hZ7iamyGqv8lIumryVaO1lh4bJ-89Mi1AakSk-4vfqr8Vk70oDRJM94wV6gYx9tL9FiJt1ybpMiDsSUoXM4dCXcCYpWLnU2sXoHyYr3uWuQ5lvsUy0NKiYx2V9eJaqpdM9W3557-rjnlZA8OMJDl7p7uOtWmOb9TeAsYpy0XGhzpeB6cXZKprBdRDkUqxloQ'
            const player = new Spotify.Player({
                name: 'Spotify Clone',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });
            player.connect();
            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error(message);
            });
            
            console.log(document.getElementById('playToggle'))
            document.getElementById('playToggle').onclick = function () {
                console.log('click')
                player.togglePlay();
            };

            player.getCurrentState().then(state => {
                console.log(state)
                if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                }

                var current_track = state.track_window.current_track;
                var next_track = state.track_window.next_tracks[0];

                console.log('Currently Playing', current_track);
                console.log('Playing Next', next_track);
            });

            fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + readCookie('SpotifyBearer'),
                },
                body: JSON.stringify({
                    uris: ["spotify:track:1pfOZQDapYAnR5qbHZhsXm"],
                    device_id: device_id
                })
            })
                .then(response => {
                    console.log('ciao')
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                
        }

        








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

