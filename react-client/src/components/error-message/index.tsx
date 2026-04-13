import React from 'react';

interface Props {
  error: string;
}
const ErrorMessage = ({ error = '' }: Props) => {
  return error && <p className="text-red-500 mt-2 mb-5">{error}</p>;
};

export default ErrorMessage;
