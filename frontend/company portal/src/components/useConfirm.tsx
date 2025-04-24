import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DeleteItem {
  id: string;
  name?: string;
}

interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: DeleteItem | null;
  onConfirm: (id: string) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onOpenChange,
  item,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!item) return;
    setIsDeleting(true);
    try {
      await onConfirm(item.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-xl max-w-md max-h-[80vh] overflow-y-auto
         scrollbar-hidden hover:scrollbar-thumb-black-400 scrollbar-thumb-rounded-full"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            {item?.name ? `"${item.name}"` : "this item"}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const useConfirmDeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);

  const confirmDelete = (item: DeleteItem) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  // const handleConfirm = async (id: string) => {
  //   throw new Error("handleConfirm must be provided by the consumer");
  // };

  const ConfirmDeleteModalComponent = ({
    onConfirm,
  }: {
    onConfirm: (id: string) => Promise<void>;
  }) => (
    <ConfirmDeleteModal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setItemToDelete(null);
      }}
      item={itemToDelete}
      onConfirm={onConfirm}
    />
  );

  return {
    confirmDelete,
    ConfirmDeleteModal: ConfirmDeleteModalComponent,
  };
};