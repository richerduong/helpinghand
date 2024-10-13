'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { Dropdown } from '@/components/Dropdown';
import { TextArea } from '@/components/TextArea';
import { SingleDatePicker } from '@/components/DatePicker';
import { MultiSelectDropdown } from '@/components/MultiSelectDropdown';
import { events } from '@/types/types';
import { skillOptions, urgencyOptions } from '@/data/data';

export default function Manage() {
  // const [canEdit, setCanEdit] = useState<boolean>(false);
  const [manageInfo, setManageInfo] = useState<events>({
    event_name: '',
    event_description: '',
    location: '',
    required_skills: [],
    urgency: '',
    event_date: new Date()
  });

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
              value={manageInfo.event_name}
              placeholder="Event Name"
              onChange={(e) =>
                setManageInfo({ ...manageInfo, event_name: e.target.value })
              }
              maxLength={100}
              required
            />
            <div className="mt-4">
              <div className="flex w-full justify-between gap-x-4">
                <TextArea
                  label="Event Description"
                  value={manageInfo.event_description}
                  placeholder="Enter your event description"
                  onChange={(e) =>
                    setManageInfo({ ...manageInfo, event_description: e.target.value })
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
              <MultiSelectDropdown
                label="Required Skills"
                options={skillOptions}
                selectedOptions={manageInfo.required_skills.map(skill => {
                  const skillOption = skillOptions.find(option => option.value === skill);
                  return { value: skill, label: skillOption ? skillOption.label : skill };
                })}
                onChange={(selected) =>
                  setManageInfo({ ...manageInfo, required_skills: selected.map(option => option.value) })
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
                value={manageInfo.event_date}
                onChange={(selected) =>
                  setManageInfo({ ...manageInfo, event_date: selected || new Date()})
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