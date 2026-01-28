
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SignaturePadProps {
    value?: string;
    onChange?: (signatureData: string) => void;
    width?: number;
    height?: number;
    className?: string;
    disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
    value,
    onChange,
    width = 600,
    height = 192,
    className = '',
    disabled = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set drawing style
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Load existing signature if provided
        if (value) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                setHasSignature(true);
            };
            img.src = value;
        }
    }, []);

    // Load signature when value changes externally
    useEffect(() => {
        if (value && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                setHasSignature(true);
            };
            img.src = value;
        }
    }, [value]);

    const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const { x, y } = getCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSignature(true);
    }, [disabled, getCoordinates]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || disabled) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const { x, y } = getCoordinates(e);

        ctx.lineTo(x, y);
        ctx.stroke();
    }, [isDrawing, disabled, getCoordinates]);

    const stopDrawing = useCallback(() => {
        if (!isDrawing) return;

        setIsDrawing(false);

        // Save signature as base64
        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const signatureData = canvas.toDataURL('image/png');
            onChange(signatureData);
        }
    }, [isDrawing, onChange]);

    const clearSignature = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);

        if (onChange) {
            onChange('');
        }
    }, [onChange]);

    // Handle touch events
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const preventScroll = (e: TouchEvent) => {
            if (isDrawing) {
                e.preventDefault();
            }
        };

        canvas.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            canvas.removeEventListener('touchmove', preventScroll);
        };
    }, [isDrawing]);

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                className={`w-full border-2 border-dashed rounded-lg bg-gray-50 transition-colors ${disabled
                        ? 'border-gray-200 cursor-not-allowed'
                        : hasSignature
                            ? 'border-[#2563EB] cursor-crosshair'
                            : 'border-gray-300 hover:border-[#2563EB] cursor-crosshair'
                    }`}
                style={{ height: `${height}px`, touchAction: 'none' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />

            {!hasSignature && !disabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm text-gray-400 select-none">
                        Assine aqui com o mouse ou dedo
                    </span>
                </div>
            )}

            {!disabled && (
                <div className="flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Limpar assinatura
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignaturePad;
