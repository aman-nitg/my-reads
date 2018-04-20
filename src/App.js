import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: [],
    query: '',
    searchedBooks: [],
    error: false,
    showLoader: false
  };

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books });
    })
  }

  updateShelf = (shelf, book) => {
    book.shelf = shelf;
    this.setState((state) => ({
      books: state.books.filter(b => b.id !== book.id).concat(book)
    }));
    BooksAPI.update(book, shelf)
  };

  updateQuery = (query) => {
    this.setState({ query, showLoader: true }, this.submitSearch);
  };

  submitSearch() {
    if(this.state.query) {
      BooksAPI.search(this.state.query).then((books) => {
        if (books.error && books.error === 'empty query') {
          this.setState({ searchedBooks: [], error: true, showLoader: false });
        } else {
          this.setState({ searchedBooks: books, error: false, showLoader: false })
        }
      })
    } else {
      this.setState({ searchedBooks: [], showLoader: false })
    }
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={ () => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search">Close</Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(e) => this.updateQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              {this.state.error && <p style={{textAlign: 'center'}}>No results</p>}
              {this.state.showLoader && <img src={require("./icons/loader.gif")} alt="loader" className="loader"/>}
              <ol className="books-grid">
                {!this.state.showLoader && this.state.searchedBooks.length > 0 && this.state.searchedBooks.map((book) => (
                  <li key={book.id}>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 193,
                            backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ''})`
                          }}>
                        </div>
                        <div className="book-shelf-changer">
                          <select
                            value={
                              this.state.books
                              .filter((b) => b.id === book.id).length ?
                              this.state.books.filter((b) => b.id === book.id)[0].shelf : 'none'
                            }
                            onChange={(e) => this.updateShelf(e.target.value, book)}>
                            <option disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      {book.authors && book.authors.map((author, index) => (
                        <div key={index} className="book-authors">{author}</div>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}/>

        <Route exact path="/" render={ () => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.books.filter((book) => book.shelf === "currentlyReading").map((book) => (
                        <li key={book.id}>
                          <div className="book">
                            <div className="book-top">
                              <div
                                className="book-cover"
                                style={{
                                  width: 128,
                                  height: 193,
                                  backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ''})`
                                }}>
                              </div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={(e) => this.updateShelf(e.target.value, book)}>
                                  <option value="none" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map((author, index) => (
                              <div key={index} className="book-authors">{author}</div>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.books.filter((book) => book.shelf === "wantToRead").map((book) => (
                        <li key={book.id}>
                          <div className="book">
                            <div className="book-top">
                              <div
                                className="book-cover"
                                style={{
                                  width: 128,
                                  height: 193,
                                  backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ''})`
                                }}>
                              </div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={(e) => this.updateShelf(e.target.value, book)}>
                                  <option value="none" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map((author, index) =>
                              <div key={index} className="book-authors">{author}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.books.filter((book) => book.shelf === "read").map((book) => (
                        <li key={book.id}>
                          <div className="book">
                            <div className="book-top">
                              <div
                                className="book-cover"
                                style={{
                                  width: 128,
                                  height: 192,
                                  backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ''})`
                                }}>
                              </div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={(e) => this.updateShelf(e.target.value, book)}>
                                  <option value="none" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map((author, index) =>
                              <div key={index} className="book-authors">{author}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
