import { useState, useEffect, useRef } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(1);
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
            ended = true
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemsLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current[id].focus();
    }
    function renderComicsList(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {"objectFit" : "cover"};

            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {"objectFit":"fill"}
            }
            console.log(item.price);
            return (
                <li className="comics__item"
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                key={i}
                onClick={() => { 
                    focusOnItem(i)}}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        focusOnItem(i)
                    }
                }}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div clas sName="comics__item-price">{item.price}</div>
                    </a>
                </li>
            ) 
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const items = renderComicsList(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;

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