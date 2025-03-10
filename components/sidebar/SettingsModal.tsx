"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import Image from "next/image";
import Button from "../Button";
import { FaSpinner } from "react-icons/fa"; // Import spinner from react-icons

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    setLoading(true);
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      toast("File size should not exceed 2 MB");
      setLoading(false);
      return;
    }

    const supportedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (supportedTypes.includes(file.type)) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "messenger");
      data.append("cloud_name", "dqwc6qu4h");
      fetch("https://api.cloudinary.com/v1_1/dqwc6qu4h/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setValue("image", data.url.toString(), {
            shouldValidate: true,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast("Please Select an Image!");
      setLoading(false);
      return;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  const handleClose = () => {
    setValue("name", currentUser?.name);
    setValue("image", currentUser?.image);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your Info
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                register={register}
                required
                errors={errors}
              />
              <div>
                <label className="black font-medium text-sm leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3 ">
                  <Image
                    width={60}
                    height={60}
                    className="rounded-full object-cover w-10 h-10"
                    src={
                      image ||
                      currentUser?.image ||
                      "/images/avatar-placeholder.png"
                    }
                    alt="avatar"
                  />
                  <div className="flex items-center gap-2">
                    {loading && (
                      <div className="flex items-center justify-center  bg-opacity-50 rounded-md">
                        <FaSpinner className="animate-spin text-sky-500" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                    >
                      Change Photo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button disabled={isLoading} secondary onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
