import React from 'react';

interface Props {
  title: string;
  info?: string;
}
const ProfileInfo: React.FC<Props> = ({ title, info }) => {
  if (!info) return null;

  return (
    <p className="font-semibold">
      <span className="text-gray-500 space-y-4 p-5 flex-1">{title}</span>
      {info}
    </p>
  );
};

export default ProfileInfo;
