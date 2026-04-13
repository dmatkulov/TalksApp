import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, useDisclosure } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, selectCurrent } from '@/features/user/userSlice.ts';
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from '@/app/services/userApi.ts';
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/app/services/followApi.ts';
import GoBack from '@/components/go-back';
import { BASE_URL } from '@/constants.ts';
import { Button } from '@heroui/button';
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import ProfileInfo from '@/components/profile-info';
import { formatToClientDate } from '@/utils/format-to-client-date.ts';
import CountInfo from '@/components/count-info';
import EditProfile from '@/components/edit-profile';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useSelector(selectCurrent);
  const { data } = useGetUserByIdQuery(id ?? '');
  const [followUser] = useFollowUserMutation();
  const [unFollowUser] = useUnfollowUserMutation();
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
  const [triggerCurrentQuery] = useLazyCurrentQuery();

  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetUser());
    },
    [],
  );

  if (!data) return null;

  const handleFollow = async () => {
    try {
      if (id) {
        if (data?.isFollowing) {
          await unFollowUser(id).unwrap();
        } else {
          await followUser({ followingId: id }).unwrap();
        }
      }

      await triggerGetUserByIdQuery(id);
      await triggerCurrentQuery();
    } catch (error) {
      console.error(error);
    }
  };

  const handClose = async () => {
    try {
      if (id) {
        await triggerGetUserByIdQuery(id);
        await triggerCurrentQuery();
        onClose();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <GoBack />
      <div className="flex items-stretch gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white"
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}
            {currentUser?.id !== id ? (
              <Button
                color={data?.isFollowing ? 'default' : 'primary'}
                variant="flat"
                className="gap-2"
                onPress={handleFollow}
                endContent={
                  data?.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data?.isFollowing ? 'Отписаться' : 'Подписаться'}
              </Button>
            ) : (
              <Button endContent={<CiEdit />} onPress={() => onOpen()}>
                Редактировать
              </Button>
            )}
          </div>
        </Card>
        <Card className="flex flex-col space-y-5 p-5 flex-2">
          <div className="flex flex-col gap-4">
            <ProfileInfo title="Почта:" info={data.email} />
            <ProfileInfo title="Местоположение:" info={data.location} />
            <ProfileInfo
              title="Дата рождения:"
              info={formatToClientDate(data.dateOfBirth)}
            />
            <ProfileInfo title="Обо мне:" info={data.bio} />
          </div>

          <hr className="mt-10" />

          <div className="flex flex-row justify-around gap-4 mt-5">
            <CountInfo count={data.followers.length} title="Подписчики" />
            <CountInfo count={data.following.length} title="Подписки" />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={handClose} user={data} />
    </>
  );
};

export default UserProfile;
