import React, { useContext, useState } from 'react';
import { User } from '@/app/types';
import { ThemeContext } from '@/components/theme-provider';
import { useUpdateUserMutation } from '@/app/services/userApi.ts';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import Input from '@/components/input';
import ErrorMessage from '@/components/error-message';
import { hasErrorField } from '@/utils/has-error-field.ts';
import { MdOutlineEmail } from 'react-icons/md';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

const EditProfile: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { theme } = useContext(ThemeContext);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { id } = useParams<{ id: string }>();

  const { handleSubmit, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: user?.email ?? '',
      name: user?.name ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
      bio: user?.bio ?? '',
      location: user?.location ?? '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData();
        data.name && formData.append('name', data.name);
        data.email &&
          data.email !== user?.email &&
          formData.append('email', data.email);
        data.dateOfBirth &&
          formData.append(
            'dateOfBirth',
            new Date(data.dateOfBirth).toISOString(),
          );
        data.bio && formData.append('bio', data.bio);
        data.location && formData.append('location', data.location);
        selectedFile && formData.append('avatar', selectedFile);

        await updateUser({ userData: formData, id }).unwrap();
        onClose();
      } catch (err) {
        console.log(err);
        if (hasErrorField(err)) {
          setError(err.data.error);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Изменения профиля
            </ModalHeader>
            <ModalBody>
              <form
                id="edit-profile-form"
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  endContent={<MdOutlineEmail />}
                />
                <Input control={control} name="name" label="Имя" type="text" />
                <Button>
                  <input
                    name="avatarUrl"
                    placeholder="Выберете файл"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
                <Input
                  control={control}
                  name="dateOfBirth"
                  label="Дата Рождения"
                  type="date"
                  placeholder="Мой"
                />
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Ваша биография"
                    />
                  )}
                />
                <Input
                  control={control}
                  name="location"
                  label="Местоположение"
                  type="text"
                />
                <ErrorMessage error={error} />
              </form>
            </ModalBody>

            <ModalFooter>
              <div className="flex flex-row gap-4 justify-between flex-grow">
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  form="edit-profile-form"
                >
                  Обновить профиль
                </Button>
                <Button
                  fullWidth
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                >
                  Закрыть
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
