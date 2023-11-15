import defaultExport from './auth.js'
const options = defaultExport;
console.log(options)
const getAlbum = async (id) => {
    const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, options)
    console.log(await res.json())
}

getAlbum('4aawyAB9vmqN3uQ7FjRGTy')

const getProfile = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me`, options)
    console.log(await res.json())
}
getProfile()