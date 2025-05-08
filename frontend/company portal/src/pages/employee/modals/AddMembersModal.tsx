// src/components/modals/AddMembersModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getGroupByMemberService } from "../../../services/user/userService";
import { ChatUser } from "../../../utils/Interfaces/interfaces";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  allUsers: ChatUser[];
  onAddMembers: (userIds: string[]) => Promise<void>;
}

export const AddMembersModal = ({
  isOpen,
  onClose,
  groupId,
  allUsers,
  onAddMembers,
}: AddMembersModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentMembers, setCurrentMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(()=>{
    if (!isOpen) return;
    const fetchGroup = async ()=> {
        const response = await getGroupByMemberService();
        const filteredGroup = response.find((group: { _id: string; }) => group._id == groupId)
        setCurrentMembers(filteredGroup.members);
    }
    fetchGroup();
  },[groupId]);

  const availableUsers = allUsers.filter(
    (user) => !currentMembers.includes(user._id)
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onAddMembers(selectedUsers);
      onClose();
      setSelectedUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="space-y-2">
            {availableUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedUsers.includes(user._id)
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => toggleUserSelection(user._id)}
              >
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user.profilePic} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="flex-1">{user.fullName}</span>
                {selectedUsers.includes(user._id) ? (
                  <Check className="h-4 w-4 text-blue-500" />
                ) : null}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : "Add Members"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};