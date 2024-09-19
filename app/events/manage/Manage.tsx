'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { Dropdown } from '@/components/Dropdown';
import { TextArea } from '@/components/TextArea';
import { SingleDatePicker } from '@/components/DatePicker';

interface ManageInfo {
  eventName: string;
  eventDecription: string;
  location: string;
  urgency: string;
  eventDate: Date;
}

export default function Manage() {
  // const [canEdit, setCanEdit] = useState<boolean>(false);
  const [manageInfo, setManageInfo] = useState<ManageInfo>({
    eventName: '',
    eventDecription: '',
    location: '',
    urgency: '',
        eventDate: new Date()
  });

  // TODO: Move to DB to store states
  const urgencyOptions = [
    'None', 'Low', 'Medium', 'High', 'Crtitical'
  ];

  // useEffect(() => {
  //   fetchProfileInfo();
  // }, [session]);

  // const handleUpdateProfile = async () => {
  //   // Validate profile info
  //   if (!profileInfo.fullName) {
  //     toast.error('Full Name is required.');
  //     return;
  //   }

  //   try {
  //     // const usernameResponse = await getAddress2(session?.user?.id as string);
      
  //     // const { newAddress2 , ...rest } = profileInfo;
  //     // const response = await updateProfile(session?.user?.id as string, { ...rest, username: newAddress2 });

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
  //   email: '',
  //   fullName: '',
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
      <h2 className="text-2xl font-semibold text-black-text">Event Management</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Create a new event.
      </h4>
      <hr className="border-gray-300 w-full my-4"/>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <form className="w-full text-sm text-black p-4 mb-4 rounded-xl bg-white rounded-tl-none">
            <FormInput
              label="Event Name"
              type="text"
              value={manageInfo.eventName}
              placeholder="Event Name"
              onChange={(e) =>
                setManageInfo({ ...manageInfo, eventName: e.target.value })
              }
              maxLength={100}
              required
            />
            <div className="mt-4">
              <div className="flex w-full justify-between gap-x-4">
                <TextArea
                  label="Event Description"
                  value={manageInfo.eventDecription}
                  placeholder="Enter your event description"
                  onChange={(e) =>
                    setManageInfo({ ...manageInfo, eventDecription: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <FormInput
                label="Location"
                type="text"
                value={manageInfo.location}
                placeholder="Location"
                onChange={(e) =>
                  setManageInfo({ ...manageInfo, location: e.target.value })
                }
                required
              />
            </div>
            <div className="mt-4">
              <Dropdown
                  label="Urgency"
                  value={manageInfo.urgency}
                  options={urgencyOptions}
                  onChange={(e) =>
                    setManageInfo({ ...manageInfo, urgency: e.target.value })
                  }
                  required
                />
            </div>
            <div className='mt-4'>
              <SingleDatePicker
                label="Event Date"
                value={manageInfo.eventDate}
                onChange={(selected) =>
                  setManageInfo({ ...manageInfo, eventDate: selected || new Date()})
                }
                required
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}