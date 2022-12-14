
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';

import { useState } from 'react';
import './findChar.scss';

const setContent = (process, Component) => {
    switch (process) {
        case 'waiting':
            return null
        case 'loading':
            return null
        case 'error':
            return <div className="char__search-critical-error"><ErrorMessage /></div>
        case 'confirmed':
            return <Component/>
        default:
            throw new Error('Unexpected default state');    
    }
}

const FindChar = () => {
    const [char, setChar] = useState(null);

    const {process, setProcess, getCharByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();
        getCharByName(name)
            .then(onCharLoaded)
            .then(setProcess('confirmed'))
    }
    function renderMessage(char) {
        const successResult = (char) => {
            return (
                <div className="char__search-wrapper">
                    <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                    <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                        <div className="inner">To page</div>
                    </Link>
                </div>
            )
        } 
        const notFoundResult = () => {
            return (
                <div className="char__search-error">
                    The character was not found. Check the name and try again
                </div>
            )
        }
        const result = !char ? null : (char.length > 0 ? successResult(char) : notFoundResult());
        return (result)
    }
    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main">
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {setContent(process, () => renderMessage(char))}
        </div>
    )
}

export default FindChar;