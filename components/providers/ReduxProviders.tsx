'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import AuthBootstrap from './AuthBootstrap';

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}