import { createStore, combineReducers } from 'redux';

// Define initial state
const initialState = {
    books: [],
    currentBookIndex: 0,
};

// Define actions
const SET_BOOKS = 'SET_BOOKS';
const SET_CURRENT_BOOK_INDEX = 'SET_CURRENT_BOOK_INDEX';

// Define action creators
export const setBooks = (books) => ({
    type: SET_BOOKS,
    payload: books,
});

export const setCurrentBookIndex = (index) => ({
    type: SET_CURRENT_BOOK_INDEX,
    payload: index,
});

// Define reducers
const booksReducer = (state = initialState.books, action) => {
    switch (action.type) {
        case SET_BOOKS:
            return action.payload;
        default:
            return state;
    }
};

const currentBookIndexReducer = (state = initialState.currentBookIndex, action) => {
    switch (action.type) {
        case SET_CURRENT_BOOK_INDEX:
            return action.payload;
        default:
            return state;
    }
};

// Combine reducers
const rootReducer = combineReducers({
    books: booksReducer,
    currentBookIndex: currentBookIndexReducer,
});

// Create store
const store = createStore(rootReducer);

export default store;
