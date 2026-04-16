import React, { useRef, useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';
import { X } from 'lucide-react';


export interface CommonDialogProps {
  open?: boolean;
  onClose?: (event?: React.SyntheticEvent | {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  title?: string | ReactNode;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  persistent?: boolean;
  titleIcon?: ReactNode;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  open = false,
  onClose,
  title = 'Dialog',
  children,
  maxWidth = 'sm',
  fullWidth = true,
  persistent = false,
  titleIcon = null
}) => {
  const [shaking, setShaking] = useState(false);

  /* Fires when backdrop is clicked or ESC is pressed */
  const handleClose = (event: React.SyntheticEvent | {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (persistent) {
      if (!shaking) {
        setShaking(true);
        setTimeout(() => setShaking(false), 400); // match animation duration
      }
      return;
    }
    if (onClose) onClose(event, reason);
  };

  /* Close button only works when not persistent or handles close directly */
  const handleCloseButton = () => {
    if (onClose) onClose({}, 'escapeKeyDown'); // Passing dummy event parameters to satisfy interface
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {shaking && (
        <style>
          {`
            @keyframes shake {
              0%,100% { transform: translateX(0); }
              20%      { transform: translateX(-6px); }
              40%      { transform: translateX(6px);  }
              60%      { transform: translateX(-4px); }
              80%      { transform: translateX(4px);  }
            }
          `}
        </style>
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <DialogTitle className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-sidebar gap-3 m-0">
        {/* Left side: optional icon + title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {titleIcon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
              {titleIcon}
            </div>
          )}

          <h2 className="text-base font-semibold text-text-main tracking-tight truncate m-0">
            {title}
          </h2>
        </div>

        {/* Right side: close button */}
        <button
          onClick={handleCloseButton}
          aria-label="Close dialog"
          className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-colors shrink-0 cursor-pointer border-none outline-none"
        >
          <X size={16} />
        </button>
      </DialogTitle>

      <Divider className="dark:border-gray-800/80" />

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <DialogContent className="px-6 py-6 dark:bg-sidebar">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
