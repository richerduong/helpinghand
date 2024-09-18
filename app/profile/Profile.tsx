'use client';

import { useState } from 'react';
// import { Session } from 'next-auth';
// import clsx from 'clsx';
// import toast from 'react-hot-toast';
// import { getProfile, updateProfile } from './actions';
import { FormInput } from '@/components/FormInput';
import { Dropdown } from '@/components/Dropdown';
import { MultiSelectDropdown } from '@/components/MultiSelectDropdown';
import { TextArea } from '@/components/TextArea';
import { Option } from '@/components/MultiSelectDropdown';
import { MultiDatePicker } from '@/components/MultiDatePicker';

interface ProfileInfo {
  email: string;
  fullName: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  skills: Option[];
  preferences: string;
  availability: Date[];
}

// interface ProfileProps {
//   session: Session | null;
// }

export default function Profile() {
  // const [canEdit, setCanEdit] = useState<boolean>(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    email: '',
    fullName: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: [],
  });

  // TODO: Move to DB to store states
  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // TODO: Move to database and update skills
  const skillOptions: Option[] = [
    { label: 'First Aid', value: 'first-aid' },
    { label: 'Event Management', value: 'event-management' },
    { label: 'Fundraising', value: 'fundraising' },
    { label: 'Teaching & Mentoring', value: 'teaching-mentoring' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Transportation Assistance', value: 'transportation-assistance' },
    { label: 'Administrative Work', value: 'administrative-work' },
    { label: 'Disaster Relief', value: 'disaster-relief' },
    { label: 'Community Outreach', value: 'community-outreach' },
    { label: 'Technical Support', value: 'technical-support' },
    { label: 'Language Translation', value: 'language-translation' },
    // Add more skills as needed
  ];

  const validateProfile = () => {
    const errors: string[] = [];

    if (profileInfo.fullName.length > 50) {
      errors.push('Full Name must not exceed 50 characters.');
    }
    if (profileInfo.address1.length > 100) {
      errors.push('Address 1 must not exceed 100 characters.');
    }
    if (profileInfo.city.length > 100) {
      errors.push('City must not exceed 100 characters.');
    }
    if (profileInfo.zipCode.length < 5 || profileInfo.zipCode.length > 9) {
      errors.push('Zip Code must be between 5 and 9 characters.');
    }
    if (!profileInfo.state) {
      errors.push('State is required.');
    }
    if (profileInfo.skills.length === 0) {
      errors.push('At least one skill is required.');
    }
    if (profileInfo.availability.length === 0) {
      errors.push('Availability is required.');
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateProfile();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Submit the form data
    console.log('Profile info is valid:', profileInfo);
  };

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
      <h2 className="text-2xl font-semibold text-black-text">Profile</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Manage your account information.
      </h4>
      <hr className="border-gray-300 w-full my-4" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <form className="w-full text-sm text-black p-4 mb-4 rounded-xl bg-white rounded-tl-none" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <FormInput
              label="Full Name"
              type="text"
              value={profileInfo.fullName}
              placeholder="Full Name"
              onChange={(e) => setProfileInfo({ ...profileInfo, fullName: e.target.value })}
              maxLength={50}
              required
            />
            <div className="mt-4">
              <div className="flex w-full justify-between gap-x-4">
                <FormInput
                  label="Address 1"
                  type="text"
                  value={profileInfo.address1}
                  placeholder="Address 1"
                  onChange={(e) => setProfileInfo({ ...profileInfo, address1: e.target.value })}
                  maxLength={100}
                  required
                />
                <FormInput
                  label="Address 2"
                  type="text"
                  value={profileInfo.address2}
                  placeholder="Address 2"
                  onChange={(e) => setProfileInfo({ ...profileInfo, address2: e.target.value })}
                  maxLength={100}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex w-full justify-between gap-x-4">
                <FormInput
                  label="City"
                  type="text"
                  value={profileInfo.city}
                  placeholder="City"
                  onChange={(e) => setProfileInfo({ ...profileInfo, city: e.target.value })}
                  maxLength={100}
                  required
                />
                <Dropdown
                  label="State"
                  value={profileInfo.state}
                  options={stateOptions}
                  onChange={(e) => setProfileInfo({ ...profileInfo, state: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <FormInput
                label="Zip Code"
                type="text"
                value={profileInfo.zipCode}
                placeholder="Zip Code"
                onChange={(e) => setProfileInfo({ ...profileInfo, zipCode: e.target.value })}
                minLength={5}
                maxLength={9}
                required
              />
            </div>
            <div className="mt-4">
              <MultiSelectDropdown
                label="Skills"
                options={skillOptions}
                selectedOptions={profileInfo.skills}
                onChange={(selected) => setProfileInfo({ ...profileInfo, skills: selected })}
                required
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Preferences"
                value={profileInfo.preferences}
                placeholder="Enter your preferences"
                onChange={(e) => setProfileInfo({ ...profileInfo, preferences: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <MultiDatePicker
                label="Availability"
                value={profileInfo.availability}
                onChange={(selected) => setProfileInfo({ ...profileInfo, availability: selected })}
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="mt-6 bg-orange text-white py-2 px-4 rounded-lg">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}