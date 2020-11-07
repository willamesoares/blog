import React from 'react';
import { createUseStyles } from 'react-jss';

import Comment from './comment';

const useStyles = createUseStyles({
  commentList: {
    '& > ul': {
      margin: 0
    }
  }
});

const CommentList = props => {
  const { comments = [], docId } = props;
  const classes = useStyles();

  const parentComments = comments.reduce((acc, comment) => {
    if (comment.parentId !== null) {
      acc[comment.parentId] = {
        ...acc[comment.parentId],
        replies: [...((acc[comment.parentId] || {}).replies || []), comment]
      };
    } else {
      acc[comment.id] = {
        ...comment,
        replies: [...((acc[comment.id] || {}).replies || [])]
      };
    }

    return acc;
  }, {});

  return (
    <div className={classes.commentList}>
      {Object.entries(parentComments).map(([id, comment]) => {
        return comment.id ? (
          <ul key={id}>
            <Comment docId={docId} {...comment} />
            {(comment.replies || []).length ? (
              <ul>
                {comment.replies.map(c => (
                  <Comment key={c.id} docId={docId} {...c} />
                ))}
              </ul>
            ) : null}
          </ul>
        ) : null;
      })}
    </div>
  );
};

export default CommentList;
