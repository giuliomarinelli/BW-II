// Funzione di utilità per la creazione di stringhe di query URL

function playSong(...trackUri) {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + readCookie('SpotifyBearer'),
        },
        body: JSON.stringify({
            uris: trackUri,
            device_id: localStorage.getItem('device_id'),
            play: true
        })
    })
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

document.addEventListener('DOMContentLoaded', () => {
    function getTemplate(i) {
        const template = document.getElementsByTagName("template")[i];
        return template.content.firstElementChild.cloneNode(true);
    }
    console.log(readCookie('SpotifyBearer'))

    const clone = getTemplate(0);
    document.getElementById('append-wrapper').append(clone)
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
            a.classList.add('playlist-list-item', 'd-block', 'mb-2', 'album-link', 'play')
            a.innerText = el.name;
            a.href = '#'
            a.setAttribute('data-id', el.album.id)
            a.setAttribute('data-uri', el.album.uri)
            document.querySelector('.playlist-list').append(a);
        })
        const res3 = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=6', options);
        const data3 = await res3.json();
        console.log(data3)
        document.querySelectorAll('.top-songs').forEach((el, ind) => {
            const a = document.createElement('a');
            a.innerText = data3.items[ind].name;
            a.href = '#'
            a.classList.add('play')
            a.setAttribute('data-id', data3.items[ind].id)
            a.setAttribute('data-uri', data3.items[ind].uri)

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
            a.classList.add('artist-link', 'play')
            a.innerText = data4.artists.items[ind].name;
            a.setAttribute('data-id', data4.artists.items[ind].id)
            a.setAttribute('data-uri', data4.artists.items[ind].uri)
            el.querySelector('h5').innerText = ''
            el.querySelector('h5').append(a);
            el.querySelector('p').innerText = ''
        })

        document.querySelectorAll('.album-link').forEach(el => el.addEventListener('click', async (e) => {
            e.preventDefault()
            const clone = getTemplate(1);
            document.getElementById('content').remove()
            document.getElementById('append-wrapper').append(clone)
            document.getElementById('username').innerText = data1.display_name;
            console.log(`https://api.spotify.com/v1/albums/${el.getAttribute('data-id')}`)
            const res6 = await fetch(`https://api.spotify.com/v1/albums/${el.getAttribute('data-id')}`, options)

            const data6 = await res6.json()
            console.log(data6)
            
            document.getElementById('total-tracks').innerText = data6.total_tracks;
            document.getElementById('album-name').innerText = data6.name;
            document.getElementById('album-img').src = data6.images[1].url;
            data6.tracks.items.forEach((el, ind) => {
                const clone = getTemplate(3);
                let artists = ''
                el.artists.forEach(el => artists +=  '<a href="#" data-id="' + el.id + '" class="artist">' + el.name + '</a>&nbsp;')
                document.getElementById('artist-link').innerHTML = artists;
                clone.querySelector('.song-td-name').innerHTML = `<a href="#" data-uri="${el.uri}" class="play">${el.name}</a>`;
                clone.querySelector('.song-td-artists').innerHTML = artists
                clone.querySelector('#number').innerText = ind + 1;
                document.getElementById('album-tracks').append(clone);


            })

            document.querySelectorAll('.artist').forEach(el => el.addEventListener('click', async (e) => {
                e.preventDefault();
                const clone = getTemplate(2);
                document.getElementById('content').remove()
                clone.querySelector('#username').innerText = data1.display_name;
                const res_artist = await fetch(`https://api.spotify.com/v1/artists/${el.getAttribute('data-id')}`, options)
                const data_artist = await res_artist.json();
                console.log(data_artist)
                clone.querySelector('#artist-name').innerText = data_artist.name;
                document.getElementById('append-wrapper').append(clone)

            }))
            document.querySelectorAll('.play').forEach(el => el.addEventListener('click', (e) => {
                e.preventDefault()
                playSong(el.getAttribute('data-uri'));
            }))
            
        }))
    }
    api();
    document.getElementById('home').addEventListener('click', () => {
        const clone = getTemplate(0)
        document.getElementById('content').remove()
        document.getElementById('append-wrapper').append(clone)
        api()
    })
    async function getDevices() {
        const res5 = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                'Authorization': `Bearer ${readCookie('SpotifyBearer')}`
            }
        }
        );
        const devices = await res5.json();
        return devices
    }

    document.getElementById('playToggle').addEventListener('click', (e) => e.target.classList.toggle('active'))
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = readCookie('SpotifyBearer')
        const deviceName = 'Spotify Clone';


        const player = new Spotify.Player({
            name: deviceName,
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
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

        async function setActivePlayer(device_id) {

            return await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${readCookie('SpotifyBearer')}`
                },
                body: JSON.stringify({
                    "device_ids": [
                        device_id
                    ]
                })
            });

        }

        player.connect().then(success => {
            if (success) {
                console.log('The Web Playback SDK successfully connected to Spotify!');
            }
            document.getElementById('playToggle').click();
            document.getElementById('playToggle').click();


            // Ready
            player.addListener('ready', ({ device_id }) => {

                console.log('Ready with Device ID', device_id);//può essere di un dispositivo secondario
                getDevices().then(async res => {
                    console.log(Object.values(res)[0]);
                    let found = Object.values(res)[0].find(d => d.name == deviceName)
                    localStorage.setItem('device_id', found.id)
                    console.log(found);

                    setActivePlayer(found.id).then(res => {
                        //loader scompare

                    })


                })
                // alert('pronto');                
            });

        })



        console.log(document.getElementById('playToggle'))
        document.getElementById('playToggle').onclick = function () {
            //console.log('click')
            player.togglePlay()
        };

        player.getCurrentState().then(state => {
            //console.log(state)
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }

            var current_track = state.track_window.current_track;
            var next_track = state.track_window.next_tracks[0];

            console.log('Currently Playing', current_track);
            console.log('Playing Next', next_track);
        });


    }










})












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

