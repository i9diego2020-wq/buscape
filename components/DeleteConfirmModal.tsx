import React from 'react';
import Modal from './Modal';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    itemName: string;
    loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar Exclusão',
    itemName,
    loading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        Excluir
                    </button>
                </>
            }
        >
            <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-danger">warning</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                    Tem certeza que deseja excluir <strong className="text-slate-800 dark:text-white">{itemName}</strong>?
                </p>
                <p className="text-sm text-slate-400 mt-2">Esta ação não pode ser desfeita.</p>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
