// Funzione di utilità per la creazione di stringhe di query URL
function queryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURI(key)}=${encodeURI(params[key])}`)
        .join('&');
}

// URL di redirect e credenziali dell'app Spotify
var redirect_uri = 'http://127.0.0.1:5500/homepage.html';
var client_id = 'a08665dce25b4dd4b88d1d5a503b023e';
var client_secret = 'f57fe89e798f45cdb7551be784ac4600';

// Gestione del callback nel browser
function handleCallback() {
    var code = new URLSearchParams(window.location.search).get('code');
    var state = new URLSearchParams(window.location.search).get('state');
    console.log(code)

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

    let options;
    // Effettua la richiesta di token
    fetch('https://accounts.spotify.com/api/token', authOptions)
        .then(response => response.json())
        .then(data => {
            // Gestisci la risposta del server
            console.log('Token di accesso:', data);
            const getProfile = async () => {
                options = {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }


                const res = await fetch(`https://api.spotify.com/v1/me`, options)
                console.log(await res.json())
                const res1 = await fetch('https://api.spotify.com/v1/me/player', options)
               
            }
            getProfile()
            
        })
        .catch(error => {
            // Gestisci eventuali errori nella richiesta
            console.error('Errore durante la richiesta del token:', error);
        });

}


// Chiamare la funzione di gestione del callback al caricamento della pagina
handleCallback();