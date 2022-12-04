import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {

    const {loading, error, request, clearError} = useHttp();
    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=79bdfc05b5558c65076634caca17d8e8";
    const _baseOffset = 1540;
    const _baseComicsOffset = 0;

    const getAllCharacters = async(offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }
    const getOneCharacter = async(id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }
    const getComics = async(comicsOffset = _baseComicsOffset) => {
        const res = await request (`${_apiBase}comics?limit=8&offset=${comicsOffset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    const getOneComic = async (id) => {
        const res = await request (`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }
    const getCharByName = async(name) => {
        const res = await request (`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
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
    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description,
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: (comics.prices[0].price !== 0) ? comics.prices[0].price + '$' : 'NOT AVAILABLE',
        }
    }
    return {loading, error, getAllCharacters, getOneCharacter, getComics, getOneComic, getCharByName,clearError};
}




export default useMarvelService;