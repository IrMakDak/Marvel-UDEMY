import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(8);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getComics(offset)
            .then(onComicsListLoaded)
    }
    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewItemsLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }
    function renderComicsList(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {"objectFit" : "cover"};

            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {"objectFit":"fill"}
            }
            return (
                <li className="comics__item" key={i}>
                   <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div clas sName="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            ) 
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = (loading && !newItemsLoading) ? <Spinner/> : null;
    const items = renderComicsList(comicsList);

    return (
        <div className="comics__list">
            {errorMessage} {spinner} {items}
            <button className="button button__main button__long"
            disabled={newItemsLoading}
            style={{'display': (comicsEnded) ? "none" : "block"}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;