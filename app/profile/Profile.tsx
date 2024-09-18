'use client';

import { ChangeEvent, useState } from 'react';
// import { Session } from 'next-auth';
import clsx from 'clsx';
// import toast from 'react-hot-toast';
import { checkUsernameAvailability } from '@/utils/api';
// import { getProfile, getUsername, updateProfile } from './actions';

interface ProfileInfo {
  username: string;
  newUsername: string,
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// interface ProfileProps {
//   session: Session | null;
// }

export default function Profile() {
  // const [canEdit, setCanEdit] = useState<boolean>(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    username: '',
    newUsername: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [availableUsername, setAvailableUsername] = useState<boolean>(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  // useEffect(() => {
  //   fetchProfileInfo();
  // }, [session]);

  const handleUsernameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { value } = e.target;

    setProfileInfo({ ...profileInfo, newUsername: value });

    const pattern = /^(?=.*[A-Za-z])[A-Za-z0-9_]+$/;
    const isValid = pattern.test(value);

    setIsUsernameValid(isValid);

    setAvailableUsername(true);
    if (isValid && profileInfo.username !== value) {
      const { available } = await checkUsernameAvailability();

      setAvailableUsername(available);
    }
  };

  // const handleUpdateProfile = async () => {
  //   // Validate profile info
  //   if (!isUsernameValid || !availableUsername) {
  //     toast.error('Invalid username.');
  //     return;
  //   }
  //   if (!availableUsername) {
  //     toast.error('Username unavailable.');
  //     return;
  //   }
  //   if (!profileInfo.firstName || !profileInfo.lastName || !profileInfo.username) {
  //     toast.error('First name, last name, and username are required.');
  //     return;
  //   }

  //   try {
  //     // const usernameResponse = await getUsername(session?.user?.id as string);
      
  //     // const { newUsername , ...rest } = profileInfo;
  //     // const response = await updateProfile(session?.user?.id as string, { ...rest, username: newUsername });

  //     setCanEdit(false);

  //     console.log('Profile updated successfully');
  //     toast.success('Profile updated successfully.');
  //     // await fetchProfileInfo();

  //   } catch (error) {
  //     setCanEdit(false);
  //     toast.error('Failed to update profile.');
  //     console.error('Error updating profile:', error);
  //   }
  // }

  // const [oldProfileInfo, setOldProfileInfo] = useState<ProfileInfo>({
  //   username: '',
  //   newUsername: '',
  //   email: '',
  //   firstName: '',
  //   lastName: '',
  //   phoneNumber: '',
  // });
  
  // const handleEdit = () => {
  //   // store old profile info
  //   setOldProfileInfo(profileInfo);
  //   setCanEdit(!canEdit);
  // }

  // const handleCancel = () => {
  //   // restore old profile info
  //   setProfileInfo(oldProfileInfo);
  //   setCanEdit(false);
  // }

  return (
    <>
      <h2 className="text-2xl font-semibold text-black-text">Profile</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Manage your account information.
      </h4>
      <hr className="border-gray-300 w-full my-4"/>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-1/4 items-center">
          {/*
            <button
              className={clsx(
                "flex items-center justify-center gap-x-2",
                "bg-neutral-grey text-[#353F42]",
                "rounded-full",
                "border border-darkgrey-border",
                "py-2 px-4 -mt-6",
              )}
              disabled
            >
              <UploadIcon width={20} height={20}/>
              <span>Upload</span>
            </button>
          */}
        </div>
        <div className="flex flex-col w-full ml-24">
          <form className="w-full text-sm text-black p-4 mb-4 rounded-xl bg-white rounded-tl-none">
            <div className="flex w-full justify-between gap-x-6">
              <div className="flex w-full justify-between gap-x-4">
                <div className="flex flex-col w-full gap-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name<span className="text-red">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className={clsx(
                      'bg-white border border-[#C5C9D6]',
                      'w-full px-4 py-2 rounded',
                      'focus:outline-none focus:border-[#24AFFE]',
                      'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
                    )}
                    placeholder="First"
                    value={profileInfo?.firstName}
                    onChange={(e) => {
                      setProfileInfo({ ...profileInfo, firstName: e.target.value });
                    }}
                    // disabled={!canEdit}
                  />
                </div>

                <div className="flex flex-col w-full gap-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name<span className="text-red">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className={clsx(
                      'bg-white border border-[#C5C9D6]',
                      'w-full px-4 py-2 rounded',
                      'focus:outline-none focus:border-[#24AFFE]',
                      'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
                    )}
                    placeholder="Last"
                    value={profileInfo?.lastName}
                    onChange={(e) => {
                      setProfileInfo({ ...profileInfo, lastName: e.target.value });
                    }}
                    // disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col w-full gap-y-1">
                <label className="flex justify-between text-sm font-normal text-gray-700">
                  <span>Username<span className="text-red">*</span></span>
                  <div className={clsx(
                    {
                      'hidden': profileInfo.username === profileInfo.newUsername,
                    }
                  )}>
                    <span className={clsx(
                      'text-[#DF0822]',
                      {
                        'hidden': isUsernameValid
                      }
                    )}>
                      Only letters, numbers, and underscores
                    </span>
                    <span className={clsx(
                      'text-[#DF0822]',
                      {
                        'hidden': !isUsernameValid || availableUsername
                      }
                    )}>
                      Username is unavailable
                    </span>
                    <span className={clsx(
                      'text-[#24AFFE]',
                      {
                        'hidden': !isUsernameValid || !availableUsername
                      }
                    )}>
                      Username is available
                    </span>
                  </div>
                </label>
                <input
                  required
                  className={clsx(
                    'bg-white border border-[#C5C9D6]',
                    'w-full px-4 py-2 rounded',
                    'focus:outline-none',
                    {
                      // 'border-[#24AFFE] focus:border-[#24AFFE]': canEdit && (isUsernameValid || availableUsername) && profileInfo.username !== profileInfo.newUsername,
                      // 'border-[#DF0822] focus:border-[#DF0822]': canEdit && (!isUsernameValid || !availableUsername)
                    },
                    'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
                  )}
                  pattern="^(?=.*[A-Za-z])[A-Za-z0-9_]+$"
                  placeholder="Username"
                  value={profileInfo.newUsername}
                  onChange={handleUsernameChange}
                  // disabled={!canEdit}
                />
              </div>
            </div>
            <div className="flex w-full justify-between mt-4 gap-x-4">
              <div className="flex flex-col w-full gap-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email<span className="text-red">*</span>
                </label>
                <input
                  required
                  type="email"
                  className={clsx(
                    'bg-white border border-[#C5C9D6]',
                    'w-full px-4 py-2 rounded',
                    'focus:outline-none focus:border-[#24AFFE]',
                    'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
                  )}
                  placeholder="email@example.com"
                  value={profileInfo?.email}
                  disabled
                />
              </div>
              <div className="flex flex-col w-full gap-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  className={clsx(
                    'bg-white border border-[#C5C9D6]',
                    'w-full px-4 py-2 rounded',
                    'focus:outline-none focus:border-[#24AFFE]',
                    'disabled:cursor-not-allowed disabled:bg-[#F0F0F0]'
                  )}
                  placeholder="xxx-xxx-xxxx"
                  value={profileInfo?.phoneNumber}
                  onChange={(e) => {
                    setProfileInfo({ ...profileInfo, phoneNumber: e.target.value });
                  }}
                  // disabled={!canEdit}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}