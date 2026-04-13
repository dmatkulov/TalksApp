import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '@/app/services/postsApi.ts';
import Card from '@/components/card';
import GoBack from '@/components/go-back';
import CreateComment from '@/components/create-comment';

const CurrentPost = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetPostByIdQuery(params?.id ?? '');

  if (!data) {
    return <h2>Поста не существует</h2>;
  }

  const {
    content,
    id,
    authorId,
    comments,
    likes,
    author,
    likedByUser,
    createdAt,
  } = data;

  return (
    <>
      <GoBack />
      <Card
        avatarUrl={author.avatarUrl ?? ''}
        name={author.name ?? ''}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
        content={content}
        cardFor="current-post"
        commentsCount={comments.length}
        likesCount={likes.length}
      />
      <div className="mt-10">
        <CreateComment />
      </div>

      <div className="mt-10">
        {data.comments
          ? data.comments.map((comment) => (
              <Card
                avatarUrl={comment.user.avatarUrl ?? ''}
                key={comment.id}
                name={comment.user.name}
                authorId={comment.user.id}
                content={comment.content}
                cardFor="comment"
                commentId={comment.id}
                id={id}
              />
            ))
          : null}
      </div>
    </>
  );
};

export default CurrentPost;
