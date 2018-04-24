import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Book from './Book'
import PropTypes from 'prop-types'
import * as BooksAPI from "./BooksAPI";

class SearchBooks extends Component {
  state = {
    query: '',
    searchedBooks: [],
    error: false,
    showLoader: false
  };

  updateQuery = (query) => {
    this.setState({ query, showLoader: true }, this.searchResults);
  };

  searchResults() {
    if(this.state.query) {
      BooksAPI.search(this.state.query).then((books) => {
        if (books.error && books.error === 'empty query') {
          this.setState({ searchedBooks: [], error: true, showLoader: false });
        } else {
          this.setState({ searchedBooks: this.addShelfToSearchedBooks(books), error: false, showLoader: false })
        }
      })
    } else {
      this.setState({ searchedBooks: [], showLoader: false })
    }
  }

  addShelfToSearchedBooks = (searchedBooks) => (
    searchedBooks.map((sb) => {
      const book = this.props.books.find((b) => sb.id === b.id);
      book ? sb.shelf = book.shelf : sb.shelf = 'none';
      return sb
    })
  );


  render() {
    const {query, error, showLoader, searchedBooks} = this.state;
    const {onShelfChange} = this.props;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(e) => this.updateQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          {error && <p style={{textAlign: 'center'}}>No results</p>}
          {showLoader && <img src={require("./icons/loader.gif")} alt="loader" className="loader"/>}
          <ol className="books-grid">
            {!showLoader && searchedBooks.length > 0 && searchedBooks.map((book) => (
              <li key={book.id}>
                <Book
                  onShelfChange={onShelfChange}
                  book={book}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

SearchBooks.propTypes = {
  books: PropTypes.array.isRequired,
  onShelfChange: PropTypes.func.isRequired
};

export default SearchBooks