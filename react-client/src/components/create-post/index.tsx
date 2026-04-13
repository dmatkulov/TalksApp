import React from 'react';
import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from '@/app/services/postsApi.ts';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@heroui/react';
import ErrorMessage from '@/components/error-message';
import { Button } from '@heroui/button';
import { IoMdCreate } from 'react-icons/io';

interface CreatePostForm {
  post: string;
}

const CreatePost = () => {
  const [createPost] = useCreatePostMutation();
  const [triggerAllPosts] = useLazyGetAllPostsQuery();

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
      await createPost({ content: data.post }).unwrap();
      console.log('data ', data);
      console.log('data.post ', data.post);
      setValue('post', '');
      await triggerAllPosts().unwrap();
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="post"
        control={control}
        defaultValue=""
        rules={{ required: 'Обязательное поле' }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="О чем думаете?"
            className="mb-5"
          />
        )}
      />

      {errors && <ErrorMessage error={error} />}
      <div className="flex justify-between">
        <Button
          color="success"
          className="flex-end"
          endContent={<IoMdCreate />}
          type="submit"
        >
          Добавить пост
        </Button>
        <Button onPress={() => reset()}>Очистить</Button>
      </div>
    </form>
  );
};

export default CreatePost;
