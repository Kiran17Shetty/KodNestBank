import { useState, useCallback } from 'react';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
    exiting?: boolean;
}

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, 4000);
    }, []);

    return { toasts, addToast };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'} ${toast.exiting ? 'toast-exit' : ''}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
