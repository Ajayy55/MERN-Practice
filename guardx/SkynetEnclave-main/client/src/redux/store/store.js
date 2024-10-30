import { configureStore } from '@reduxjs/toolkit';
import permissionsReducer from '../PermissionsSlice';

export const store = configureStore({
  reducer: {
    permissions: permissionsReducer,
  },
});