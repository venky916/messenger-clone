"use client";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { IoTrash } from "react-icons/io5";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import Avatar from "@/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [data,isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full max-w-md">
          <div className="mt-6 flex flex-col items-center">
            <div className="mb-2">
              {data.isGroup ? (
                <AvatarGroup users={data.users} />
              ) : (
                <Avatar user={otherUser} />
              )}
            </div>
            <div>{title}</div>
            <div className="text-sm text-gray-500">{statusText}</div>
            <div className="flex gap-10 my-8">
              <div
                onClick={() => setConfirmOpen(true)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:opacity-75 transition">
                  <IoTrash size={20} />
                </div>
                <div className="text-sm font-light text-neutral-600">
                  Delete
                </div>
              </div>
            </div>
            <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
              <dl className="space-y-4 px-4">
                {data.isGroup && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Emails
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {data.users.map((user) => user.email).join(", ")}
                    </dd>
                  </div>
                )}
                {!data.isGroup && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {otherUser.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Joined
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <time dateTime={joinedDate}>{joinedDate}</time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileDrawer;
