import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {

    const {loading, error, request} = useHttp();
    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=79bdfc05b5558c65076634caca17d8e8";
    const _baseOffset = 1540;

    const getAllCharacters = async(offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }
    const getOneCharacter = async(id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: (char.description) ? `${char.description.slice(0, 210)}...` : "There is no description for this character",
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }
    return {loading, error, getAllCharacters, getOneCharacter};
}




export default useMarvelService;