import React, { useState } from 'react';
import {
  Card as HeroUiCard,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from '@heroui/react';
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from '@/app/services/likesApi.ts';
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from '@/app/services/postsApi.ts';
import { useDeleteCommentMutation } from '@/app/services/commentsApi.ts';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrent } from '@/features/user/userSlice.ts';
import User from '@/components/user';
import { formatToClientDate } from '@/utils/format-to-client-date.ts';
import { RiDeleteBinLine } from 'react-icons/ri';
import Typography from '@/components/typography';
import MetaInfo from '@/components/meta-info';
import { FaRegComment, FaRegMoon } from 'react-icons/fa';
import { FcDislike } from 'react-icons/fc';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { hasErrorField } from '@/utils/has-error-field.ts';

interface Props {
  avatarUrl: string;
  name: string;
  authorId: string;
  content: string;
  commentId?: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: Date;
  id?: string;
  cardFor: 'comment' | 'post' | 'current-post';
  likedByUser?: boolean;
}

const Card = ({
  avatarUrl = '',
  name = '',
  authorId = '',
  content = '',
  commentId = '',
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  id = '',
  cardFor = 'post',
  likedByUser = false,
}: Props) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [triggerGetPostById] = useLazyGetPostByIdQuery();
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
  const [deletePost, deletePostStatus] = useDeletePostMutation();
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrent);

  const refetchPosts = async () => {
    switch (cardFor) {
      case 'post':
        await triggerGetAllPosts().unwrap();
        break;
      case 'current-post':
        await triggerGetAllPosts().unwrap();
        break;
      case 'comment':
        await triggerGetPostById(id).unwrap();
        break;
      default:
        throw new Error('Неверный аргумент cardFor');
    }
  };

  const handleClick = async () => {
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap();

      if (cardFor === 'current-post') {
        await triggerGetPostById(id).unwrap();
      }

      if (cardFor === 'post') {
        await triggerGetAllPosts().unwrap();
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      } else {
        setError(error as string);
      }
    }
  };

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case 'post':
          await deletePost(id).unwrap();
          await refetchPosts();
          break;
        case 'current-post':
          await deletePost(id).unwrap();
          navigate('/');
          break;
        case 'comment':
          await deleteComment(commentId).unwrap();
          await refetchPosts();
          break;
        default:
          throw new Error('Неверный аргумент cardFor');
      }
    } catch (err) {
      console.log(err);
      if (hasErrorField(err)) {
        setError(err.data.error);
      } else {
        setError(err as string);
      }
    }
  };

  return (
    <HeroUiCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {authorId === currentUser?.id && (
          <div className="cursor-pointer" onClick={handleDelete}>
            {deleteCommentStatus.isLoading || deletePostStatus.isLoading ? (
              <Spinner />
            ) : (
              <RiDeleteBinLine />
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 mb-5">
        <Typography>{content}</Typography>

        {cardFor !== 'comment' && (
          <CardFooter className="gap-3">
            <div className="flex gap-5 items-center">
              <div onClick={handleClick}>
                <MetaInfo
                  count={likesCount}
                  Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                />
              </div>
              <Link to={`/posts/${id}`}>
                <MetaInfo count={commentsCount} Icon={FaRegComment} />
              </Link>
            </div>
          </CardFooter>
        )}
      </CardBody>
    </HeroUiCard>
  );
};

export default Card;
