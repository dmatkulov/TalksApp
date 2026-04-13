import React from 'react';

interface Props {
  children: React.ReactElement[] | React.ReactElement;
}
const Container: React.FC<Props> = ({ children }) => {
  return <div className="flex max-w-screen-xl mx-auto mt-10">{children}</div>;
};

export default Container;
