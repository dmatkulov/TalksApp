import React from 'react';
import { useLazyGetPostByIdQuery } from '@/app/services/postsApi.ts';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@heroui/react';
import ErrorMessage from '@/components/error-message';
import { Button } from '@heroui/button';
import { IoMdCreate } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { useCreateCommentMutation } from '@/app/services/commentsApi.ts';

interface CreatePostForm {
  post: string;
}

const CreateComment = () => {
  const { id } = useParams<{ id; string }>();
  const [createComment] = useCreateCommentMutation();
  const [getPostById] = useLazyGetPostByIdQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const error = errors?.post?.message as string;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createComment({ content: data.comment, postId: id }).unwrap();
      setValue('comment', '');
      await getPostById(id).unwrap();
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{ required: 'Обязательное поле' }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Напишите свой комментарий"
            className="mb-5"
          />
        )}
      />

      {errors && <ErrorMessage error={error} />}
      <div className="flex justify-between">
        <Button
          color="primary"
          className="flex-end"
          endContent={<IoMdCreate />}
          type="submit"
        >
          Ответить
        </Button>
        <Button onPress={() => reset()}>Очистить</Button>
      </div>
    </form>
  );
};

export default CreateComment;
