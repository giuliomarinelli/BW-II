// stored in the previous step
import defaultExport from './secret.js'
let url = new URLSearchParams(location.search);


const getAuth = async () => {
    const clientId = 'a08665dce25b4dd4b88d1d5a503b023e'
    const url1 = 'https://accounts.spotify.com/api/token';
    const form = new FormData;
    form.append('code', url.get('code'));
    form.append('redirect_uri', 'http://127.0.0.1:5500/homepage.html');
    form.append('grant_type', 'client_credentials');
    const res1 = await fetch(url1,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + defaultExport)
            },
            body: form
        })

    const data = await res1.json();
    writeCookie('SpotifyBearer', data.access_token);
    
}

setInterval(getAuth, 3600000);


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



getAuth().then(res => getProfile())





const getEntitlements = async () => {
    const authCookieContent = readCookie('SpotifyBearer');
    console.log(authCookieContent)
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authCookieContent}`,

        }
    }
    console.log(authCookieContent)
    const res = await fetch(`https://open-access.spotify.com/api/v1/get-entitlements`, options)
    console.log(await res.json())

}
const getProfile = async () => {
    const authCookieContent = readCookie('SpotifyBearer');
    console.log(authCookieContent)
    const options = {
        headers: {
            'Authorization': `Bearer ${authCookieContent}`
        }
    }
    console.log(authCookieContent)
    const res = await fetch(`https://api.spotify.com/v1/me`, options)
    console.log(await res.json())

}



const getAlbum = async (id) => {
    await getAuth()
    const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, options)

}

//getAlbum('4aawyAB9vmqN3uQ7FjRGTy')


/*
const body = await fetch(url, payload);
const response = await body.json();

localStorage.setItem('access_token', response.access_token);

/*

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQAcb8DEBeVr_02EJJG5gf0BJLTA2H-TWkHdJmdn3ExaPniOmUkknNABJ6TQ6P4dm3wCrHJCI-wuU9zAoVKXvp1z_J7DOJNz8-s6Q1MgQs65WGSbAZHIYHxbLNPnBmj_fK54qcoOcRAZ9xrWp-WkgVIX1M-diqvcbJwUe2YvPrFFSBSuey49Vcqv2oYWc0cMDeTxvHWlEe2liNpkd4iWyz5etDtbcPxQwUy9bnhZnO0j1Kel_PG33kRoLYTCbW-UTi1WPwYYZRJpMQ';
async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    })
    return await res.json();
}

async function getTopTracks() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
    )).items;
}

const topTracks = await getTopTracks();
console.log(
    topTracks?.map(
        ({ name, artists }) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
    )
);

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQAcb8DEBeVr_02EJJG5gf0BJLTA2H-TWkHdJmdn3ExaPniOmUkknNABJ6TQ6P4dm3wCrHJCI-wuU9zAoVKXvp1z_J7DOJNz8-s6Q1MgQs65WGSbAZHIYHxbLNPnBmj_fK54qcoOcRAZ9xrWp-WkgVIX1M-diqvcbJwUe2YvPrFFSBSuey49Vcqv2oYWc0cMDeTxvHWlEe2liNpkd4iWyz5etDtbcPxQwUy9bnhZnO0j1Kel_PG33kRoLYTCbW-UTi1WPwYYZRJpMQ';
async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

const topTracksIds = [
    '2fN9poqwiS4puES3qjeOrM', '5L2l7mI8J1USMzhsmdjat9', '6RAYtWl575PL3rMq3vYYUC', '0VLascXUZ2Ze2u5kUD5J1f', '0rqlSpyHSCldde0yW4rxk0'
];

async function getRecommendations() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
    return (await fetchWebApi(
        `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
    )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
    recommendedTracks.map(
        ({ name, artists }) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
    )
);


// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQAcb8DEBeVr_02EJJG5gf0BJLTA2H-TWkHdJmdn3ExaPniOmUkknNABJ6TQ6P4dm3wCrHJCI-wuU9zAoVKXvp1z_J7DOJNz8-s6Q1MgQs65WGSbAZHIYHxbLNPnBmj_fK54qcoOcRAZ9xrWp-WkgVIX1M-diqvcbJwUe2YvPrFFSBSuey49Vcqv2oYWc0cMDeTxvHWlEe2liNpkd4iWyz5etDtbcPxQwUy9bnhZnO0j1Kel_PG33kRoLYTCbW-UTi1WPwYYZRJpMQ';
async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

const tracksUri = [
    'spotify:track:2fN9poqwiS4puES3qjeOrM', 'spotify:track:0OSwWL72ImBvCEmBGzblkp', 'spotify:track:5L2l7mI8J1USMzhsmdjat9', 'spotify:track:4qg7uptMkSHq8uatbgcP37', 'spotify:track:6RAYtWl575PL3rMq3vYYUC', 'spotify:track:3IvgnZ2vUJedikovn6OLmy', 'spotify:track:0VLascXUZ2Ze2u5kUD5J1f', 'spotify:track:6foNAcmEDSJxPkGpxA3VEC', 'spotify:track:0rqlSpyHSCldde0yW4rxk0', 'spotify:track:59BxnrvaJVr6u4hs22ApiH'
];

async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi('v1/me', 'GET')

    const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`, 'POST', {
        "name": "My recommendation playlist",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": false
    })

    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
}

const createdPlaylist = await createPlaylist(tracksUri);
console.log(createdPlaylist.name, createdPlaylist.id);
*/