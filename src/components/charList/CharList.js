import './charList.scss';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import { Component } from 'react';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
    }
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
    }
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset )
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    onCharListLoaded = (newCharList) => {
        console.log(this.charList);
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList], 
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
        })) 
    }
    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true,
        })
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }
    renderItemsOfList(arr) {
        const items = arr.map(item => {
            let imgStyle = {"objectFit" : "cover"};
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {"object-fit":"unset"}
            }
            return (
                <li className="char__item" 
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            ) 
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    render() {
        const {charList, loading, error, newItemsLoading, offset} = this.state;
        const items = this.renderItemsOfList(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage} {spinner} {content}
                </ul>
                <button className="button button__main button__long"
                disabled={newItemsLoading}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
export default CharList;