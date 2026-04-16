import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface TooltipProps {
  text?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  variant?: TooltipVariant;
  placement?: TooltipPlacement;
  delay?: number;
}

const variantClasses: Record<TooltipVariant, string> = {
  default: 'bg-gray-800 text-white',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-black',
  info: 'bg-blue-600 text-white'
};

const Tooltip: React.FC<TooltipProps> = ({
  text,
  title,
  children,
  variant = 'default',
  placement = 'top',
  delay = 200
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePosition();
    setIsMounted(true);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay || 10);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    timeoutRef.current = setTimeout(() => setIsMounted(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getTooltipPosition = () => {
    const offset = 10;
    let top = 0, left = 0, transform = 'translate(-50%, -100%)';

    switch (placement) {
      case 'top':
        top = coords.top - offset; left = coords.left + coords.width / 2; transform = 'translate(-50%, -100%)'; break;
      case 'bottom':
        top = coords.top + coords.height + offset; left = coords.left + coords.width / 2; transform = 'translate(-50%, 0)'; break;
      case 'left':
        top = coords.top + coords.height / 2; left = coords.left - offset; transform = 'translate(-100%, -50%)'; break;
      case 'right':
        top = coords.top + coords.height / 2; left = coords.left + coords.width + offset; transform = 'translate(0, -50%)'; break;
      default:
        top = coords.top - offset; left = coords.left + coords.width / 2; transform = 'translate(-50%, -100%)';
    }

    return { top, left, transform };
  };

  const tooltipText = text ?? title ?? '';
  const position = getTooltipPosition();

  // Positioning the tiny arrow element accurately relative to the popup constraints
  const arrowPosition = {
    top: placement === 'bottom' ? '-4px' : placement === 'top' ? 'unset' : '50%',
    bottom: placement === 'top' ? '-4px' : 'unset',
    left: placement === 'top' || placement === 'bottom' ? '50%' : placement === 'right' ? '-4px' : 'unset',
    right: placement === 'left' ? '-4px' : 'unset',
    transform: placement === 'top' || placement === 'bottom' ? 'translateX(-50%) rotate(45deg)' : 'translateY(-50%) rotate(45deg)'
  };

  return (
    <div
      ref={containerRef}
      className="inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isMounted &&
        createPortal(
          <div
            role="tooltip"
            className={`fixed z-[99999] px-3 py-2 rounded-lg text-sm font-medium shadow-xl inline-flex flex-col whitespace-nowrap pointer-events-none transition-all duration-200 ease-out ${variantClasses[variant]}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: position.transform,
              opacity: isVisible ? 1 : 0,
            }}
          >
            {tooltipText}
            {/* Arrow */}
            <div
              className={`absolute w-2.5 h-2.5 rotate-45 -z-10 ${variantClasses[variant].split(' ')[0]}`}
              style={{ ...arrowPosition }}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
