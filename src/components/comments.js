import React, { useState } from 'react';
import { createUseStyles } from 'react-jss'

import { firestore } from '../../firebase';

const useStyles = createUseStyles({
  comment: {
    backgroundColor: '#eaebef',
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    padding: '1rem',
    '& h5': {
      margin: '0 0 .5rem 0'
    }
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  comments: {
    '& > ul': {
      margin: 0
    }
  },
  replyForm: {
    display: 'flex',
    flexDirection: 'column',
    '& input, textarea': {
      padding: '.5rem'
    },
    '& input': {
      marginTop: '.5rem'
    },
    '& textarea': {
      margin: '.3rem 0 .5rem',
      maxWidth: '100%',
      minWidth: '100%',
      minHeight: '2rem'
    },
    '& button': {
      cursor: 'pointer',
      backgroundColor: '#eaebef',
      border: '.01rem solid black',
      width: '6rem',
      height: '2rem',
      '&:disabled': {
        cursor: 'not-allowed'
      }
    }
  },
  replyFormActions: {
    '& button:last-child': {
      border: 'none'
    },
    '& button': {
      marginRight: '.5rem'
    }
  }
});

const ReplyForm = (props) => {
  const [willWriteReply, setWillWriteReply] = useState(false);
  const [replyDetails, setReplyDetails] = useState({ name: '', content: '' });
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [error, setError] = useState('');
  const classes = useStyles();

  const onFieldChangeHandler = (evt) => {
    const { name, value } = evt.target;
    setReplyDetails({
      ...replyDetails,
      [name]: value
    });
  }

  const sendReply = async () => {
    setError('');
    setIsSendingReply(true);

    const { docId } = props;
    try {
      await firestore
        .doc(`posts/${docId}`)
        .collection(`comments`)
        .add({
          time: new Date(),
          parentId: props.parentId,
          ...replyDetails
        }).then(() => {
          setReplyDetails({ name: '', content: ''});
        }).catch(() => {
          setError('Error while posting comment, please try again.');
        });
    } catch (error) {
      setError('Error while posting comment, please try again.');
    }

    setIsSendingReply(false);
  }

  return (
    <div className={classes.replyForm}>
      <button
        className={classes.replyButton}
        type='submit'
        onClick={ () => setWillWriteReply(true) }
      >
        Reply
      </button>
      { willWriteReply ? ([
        <input
          type='text'
          name='name'
          placeholder='Your Name'
          value={replyDetails.name}
          onChange={onFieldChangeHandler}
        />,
        <textarea
          type='text'
          name='content'
          placeholder='Reply'
          value={replyDetails.content}
          onChange={onFieldChangeHandler}
        />,
        <div className={classes.replyFormActions}>
          <button
            disabled={ isSendingReply || Object.values(replyDetails).some(value => !value) }
            onClick={ sendReply }
          >
            { isSendingReply ? 'Sending...' : 'Send' }
          </button>
          <button
            type='submit'
            onClick={ () => setWillWriteReply(false) }
          >
            Cancel
          </button>
        </div>
      ]) : null }
      { error ? <p>{ error }</p> : null }
    </div>
  );
}

const Comment = (props) => {
  const { content, docId, id, name, parentId, time } = props;
  const classes = useStyles();
  const date = time && time.toDate ? time.toDate() : '';
  const formattedDate = date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : '';

  return (
    <li className={classes.comment}>
      <div className={classes.commentHeader}>
        <h5>{name}</h5>
        <small>{formattedDate}</small>
      </div>
      <p>{content}</p>
      { !parentId ? <ReplyForm parentId={id} docId={docId} /> : null }
    </li>
  );
}

const Comments = (props) => {
  const { comments = [], docId } = props;
  const classes = useStyles();

  const parentComments = comments.reduce((acc, comment) => {
    if (comment.parentId !== null) {
      acc[comment.parentId] = {
        ...acc[comment.parentId],
        replies: [
          ...((acc[comment.parentId] || {}).replies || []),
          comment
        ]
      };
    } else {
      acc[comment.id] = {
        ...comment,
        replies: [
          ...((acc[comment.id] || {}).replies || [])
        ]
      };
    }

    return acc;
  }, {});

  return (
    <div className={classes.comments}>
      {Object.entries(parentComments).map(([id, comment]) => {
        return comment.id ? (
          <ul key={id}>
            <Comment docId={docId} {...comment} />
            {(comment.replies || []).length ? (
              <ul>
                {comment.replies.map(c => (
                  <Comment key={c.id} docId={docId} {...c} />)
                )}
              </ul>
            ) : null}
          </ul>
        ) : null}
      )}
    </div>
  );
}

export default Comments;
