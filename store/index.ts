import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Only persist auth state, snackbar is transient
  whitelist: ['auth'],
  // Blacklist snackbar from persistence
  blacklist: ['snackbar'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

