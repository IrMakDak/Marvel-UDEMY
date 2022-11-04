class MarvelService {

    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=79bdfc05b5558c65076634caca17d8e8";

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status = ${res.status} `);
        }
    
        return await (res.json());
    }

    getAllCharacters = async() => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }
    getOneCharacters = async(id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }
    _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension ,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
        }
    }
}




export default MarvelService;