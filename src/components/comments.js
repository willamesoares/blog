import React from 'react';
import { createUseStyles } from 'react-jss'

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
  }
});

const Comment = (props) => {
  const { content, name, time } = props;
  const classes = useStyles();
  const date = time.toDate();
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <li className={classes.comment}>
      <div className={classes.commentHeader}>
        <h5>{name}</h5>
        <small>{formattedDate}</small>
      </div>
      <p>{content}</p>
    </li>
  );
}

const Comments = (props) => {
  const { comments = [] } = props;
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
  }, {})

  return (
    <div className={classes.comments}>
      {Object.entries(parentComments).map(([id, comment]) => {
        return (
          <ul key={id}>
            <Comment {...comment} />
            {(comment.replies || []).length ? (
              <ul>
                {comment.replies.map(c => <Comment key={c.id} {...c} />)}
              </ul>
            ): null}
          </ul>
        )}
      )}
    </div>
  );
}

export default Comments;
