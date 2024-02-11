import { useState } from 'react';

// added
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/query';
import { REMOVE_BOOK } from '../utils/mutations';

import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // get user
  const user = Auth.loggedIn() ? Auth.getProfile() : null;

  const { loading, data } = useQuery(GET_ME, {
    variables: {
      username: user.data.username
    }
  });

  const items = data?.me || [];

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
       await removeBook({
        variables: {
          userId: user.data._id,
          bookId: bookId,
        },
        refetchQueries: [{ 
          query: GET_ME,
          variables: {
            username: user.data.username,
          },
        }]
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
      <Container>
        <h2 className='pt-5'>
          {items.savedBooks.length
            ? `Viewing ${items.savedBooks.length} saved ${items.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {items.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="3" className="py-2">
                <Card>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' responsive="true" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      )}
    </>
  );
};

export default SavedBooks;
