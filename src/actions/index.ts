import axios from 'axios';

import {
    SEARCH_BOOK,
    GET_BOOK
} from './types';

const ROOT_URL = 'http://localhost:8080';

export function getBooks(search: { search: string }) {
    return function(dispatch: any) {
        let searchBooks = encodeURIComponent(search.search).replace(/%20/g,'+');
        return axios.get(`${ROOT_URL}/api/search/${searchBooks}`)
            .then(response => {
                dispatch({
                    type: SEARCH_BOOK,
                    payload: response.data.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export function getBook(bookID: number) {
    return function(dispatch: any) {
        return axios.get(`${ROOT_URL}/api/book/${bookID}`)
            .then(response => {
                dispatch({
                    type: GET_BOOK,
                    payload: response.data.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
}