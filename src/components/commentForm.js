import React, { useState } from 'react';
import { createUseStyles } from 'react-jss'

import { firestore } from '../../firebase';

const useStyles = createUseStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& h3': {
      margin: '1rem 0'
    },
    '& input': {
      marginBottom: '.5rem',
      padding: '.5rem'
    },
    '& textarea': {
      marginBottom: '.5rem',
      maxWidth: '100%',
      minWidth: '100%',
      padding: '.5rem'
    },
    '& button': {
      cursor: 'pointer',
      backgroundColor: '#eaebef',
      border: '.01rem solid black',
      alignSelf: 'flex-end',
      width: '6rem',
      height: '2rem',
      '&:disabled': {
        cursor: 'not-allowed'
      }
    }
  },
  error: {
    color: 'red'
  }
});

const CommentForm = (props) => {
  const classes = useStyles();

  const [commentDetails, setCommentDetails] = useState({ name: '', content: ''});
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [error, setError] = useState('');

  const onFormSubmitHandler = async (evt) => {
    evt.preventDefault();

    setError('');
    setIsSendingComment(true);

    const { docId } = props;
    try {
      await firestore
        .doc(`posts/${docId}`)
        .collection(`comments`)
        .add({
          time: new Date(),
          parentId: null,
          ...commentDetails
        }).then(() => {
          setCommentDetails({ name: '', content: ''});
        }).catch(() => {
          setError('Error while posting comment, please try again.');
        });
    } catch (error) {
      setError('Error while posting comment, please try again.');
    }

    setIsSendingComment(false);
  }

  const onInputChangeHandler = (evt) => {
    const { name, value } = evt.target;
    setCommentDetails({
      ...commentDetails,
      [name]: value
    });
  }

  return (
    <form className={classes.form} onSubmit={onFormSubmitHandler}>
      <h3>Leave a comment</h3>
      <input
        type='text'
        name='name'
        placeholder='Your Name'
        value={commentDetails.name}
        onChange={onInputChangeHandler}
      />
      <textarea
        type='text'
        name='content'
        placeholder='Comment'
        value={commentDetails.content}
        onChange={onInputChangeHandler}
      />
      <button
        type='submit'
        disabled={isSendingComment || !(commentDetails.name && commentDetails.content)}
      >
        { isSendingComment ? 'Sending...' : 'Send' }
      </button>
      { error ? <p className={classes.error}>{error}</p> : null }
    </form>
  );
}

export default CommentForm;
