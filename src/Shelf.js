import React, { Component } from 'react'
import Book from "./Book"
import PropTypes from 'prop-types'

class Shelf extends Component {
  render() {
    const {books, onShelfChange, shelf} = this.props;
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelf.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.filter((book) => book.shelf === shelf.value).map((book) => (
              <li key={book.id}>
                <Book
                  book={book}
                  onShelfChange={onShelfChange}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

Shelf.propTypes = {
  books: PropTypes.array.isRequired,
  onShelfChange: PropTypes.func.isRequired,
  shelf: PropTypes.object.isRequired
};

export default Shelf