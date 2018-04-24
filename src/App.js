import React from 'react'
import { Route } from 'react-router-dom'
import SearchBooks from './SearchBooks'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: []
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

  render() {
    const {books} = this.state;
    return (
      <div className="app">
        <Route path="/search" render={ () => (
          <SearchBooks
            books={books}
            onShelfChange={this.updateShelf}
          />
        )}/>

        <Route exact path="/" render={ () => (
          <ListBooks
            books={books}
            onShelfChange={this.updateShelf}
          />
        )}/>
      </div>
    )
  }
}

export default BooksApp
