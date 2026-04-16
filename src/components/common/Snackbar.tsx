import React, { createContext, useContext, type ReactNode } from 'react';
import {
  SnackbarProvider as NotistackSnackbarProvider,
  useSnackbar as useNotistackSnackbar,
  type OptionsObject,
  type SnackbarKey
} from 'notistack';
import { Close as CloseIcon } from '@mui/icons-material';

export interface SnackbarMessageOptions extends OptionsObject {
  message: string | ReactNode;
  icon?: ReactNode;
  showCloseButton?: boolean;
}

export interface SnackbarContextType {
  showSnackbar: (options: SnackbarMessageOptions) => SnackbarKey;
  closeSnackbar: (key?: SnackbarKey) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

// Global augmentation
declare global {
  interface Window {
    showSnackbar: (options: SnackbarMessageOptions) => SnackbarKey;
  }
}

export interface SnackbarProviderProps {
  children: ReactNode;
  maxSnack?: number;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children, maxSnack = 3 }) => {
  return (
    <NotistackSnackbarProvider
      maxSnack={maxSnack}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      preventDuplicate
      autoHideDuration={4000}
    >
      <SnackbarContextProvider>{children}</SnackbarContextProvider>
    </NotistackSnackbarProvider>
  );
};

const SnackbarContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useNotistackSnackbar();

  React.useEffect(() => {
    window.showSnackbar = ({
      message,
      variant = 'default',
      anchorOrigin = { vertical: 'top', horizontal: 'right' },
      autoHideDuration = 4000,
      icon,
      showCloseButton = false,
      ...other
    }) => {
      return enqueueSnackbar(
        <div className="flex items-center">
          {icon && <div className="mr-2.5 flex items-center">{icon}</div>}
          <div className="font-medium">{message}</div>
        </div>,
        {
          variant,
          anchorOrigin,
          autoHideDuration,
          action: showCloseButton
            ? (snackbarId) => (
              <button
                aria-label="close"
                onClick={() => closeSnackbar(snackbarId)}
                className="bg-transparent border-none text-white opacity-80 hover:opacity-100 cursor-pointer p-1 rounded transition-opacity"
              >
                <CloseIcon fontSize="small" />
              </button>
            )
            : undefined,
          ...other
        }
      );
    };
  }, [enqueueSnackbar, closeSnackbar]);

  const showSnackbar = ({
    message,
    variant = 'default',
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
    autoHideDuration = 4000,
    icon,
    showCloseButton = false,
    ...other
  }: SnackbarMessageOptions) => {
    return enqueueSnackbar(
      <div className="flex items-center">
        {icon && <div className="mr-2.5 flex items-center">{icon}</div>}
        <div className="font-medium">{message}</div>
      </div>,
      {
        variant,
        anchorOrigin,
        autoHideDuration,
        action: showCloseButton
          ? (snackbarId) => (
            <button
              aria-label="close"
              onClick={() => closeSnackbar(snackbarId)}
              className="bg-transparent border-none text-white opacity-80 hover:opacity-100 cursor-pointer p-1 rounded transition-opacity"
            >
              <CloseIcon fontSize="small" />
            </button>
          )
          : undefined,
        ...other
      }
    );
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};
