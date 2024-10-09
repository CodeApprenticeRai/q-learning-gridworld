import dynamic from 'next/dynamic';
import React from 'react';

const NoSSRWrapper = (component) => dynamic(
  () => Promise.resolve(component),
  { ssr: false },
);

export default NoSSRWrapper;