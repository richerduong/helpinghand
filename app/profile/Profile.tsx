"use client";

import { useState, useEffect } from "react";
// import { Session } from 'next-auth';
// import clsx from 'clsx';
// import toast from 'react-hot-toast';
// import { getProfile, updateProfile } from './actions';
import { FormInput } from "@/components/FormInput";
import { Dropdown } from "@/components/Dropdown";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { TextArea } from "@/components/TextArea";
import { Option } from "@/components/MultiSelectDropdown";
import { MultiDatePicker } from "@/components/MultiDatePicker";
import supabase from '@/api/supabaseClient';
import { Session } from "@supabase/supabase-js";

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

interface ProfileProps {
  session: Session;
  setProfileComplete: (complete: boolean) => void;
}

function Profile({ session, setProfileComplete }: ProfileProps) {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    email: session?.user?.email || "",
    fullName: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
  });

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (profile) {
        setProfileInfo({
          email: profile.email,
          fullName: profile.full_name || "",
          phoneNumber: profile.phone_number || "",
          address1: profile.address1 || "",
          address2: profile.address2 || "",
          city: profile.city || "",
          state: profile.state || "",
          zipCode: profile.zip_code || "",
          skills: profile.skills || [],
          preferences: profile.preferences || "",
          availability: profile.availability || [],
        });
      }
    };

    fetchProfileInfo();
  }, [session]);

  const stateOptions = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  ];

  const skillOptions: Option[] = [
    { label: "First Aid", value: "first-aid" },
    { label: "Event Management", value: "event-management" },
    { label: "Fundraising", value: "fundraising" },
    { label: "Teaching & Mentoring", value: "teaching-mentoring" },
    { label: "Cooking", value: "cooking" },
    { label: "Transportation Assistance", value: "transportation-assistance" },
    { label: "Administrative Work", value: "administrative-work" },
    { label: "Disaster Relief", value: "disaster-relief" },
    { label: "Community Outreach", value: "community-outreach" },
    { label: "Technical Support", value: "technical-support" },
    { label: "Language Translation", value: "language-translation" },
  ];

  const validateProfile = () => {
    const errors: string[] = [];
    if (profileInfo.fullName.length > 50) {
      errors.push("Full Name must not exceed 50 characters.");
    }
    if (profileInfo.address1.length > 100) {
      errors.push("Address 1 must not exceed 100 characters.");
    }
    if (profileInfo.city.length > 100) {
      errors.push("City must not exceed 100 characters.");
    }
    if (profileInfo.zipCode.length < 5 || profileInfo.zipCode.length > 9) {
      errors.push("Zip Code must be between 5 and 9 characters.");
    }
    if (!profileInfo.state) {
      errors.push("State is required.");
    }
    if (profileInfo.skills.length === 0) {
      errors.push("At least one skill is required.");
    }
    if (profileInfo.availability.length === 0) {
      errors.push("Availability is required.");
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateProfile();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileInfo.fullName,
          address1: profileInfo.address1,
          address2: profileInfo.address2,
          city: profileInfo.city,
          state: profileInfo.state,
          zip_code: profileInfo.zipCode,
          skills: profileInfo.skills.map(skill => skill.value),
          preferences: profileInfo.preferences,
          availability: profileInfo.availability.map(date => date.toISOString()),
        })
        .eq('email', profileInfo.email);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again later.');
      } else {
        alert('Profile updated successfully!');
        setProfileComplete(true);
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-black-text">Profile</h2>
      <h4 className="mt-2 text-base font-light text-darkgrey-text">
        Manage your account information.
      </h4>
      <hr className="border-gray-300 w-full my-4" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-full">
          <form
            className="w-full text-sm text-black p-4 mb-4 rounded-xl bg-white rounded-tl-none"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormInput
              label="Full Name"
              type="text"
              value={profileInfo.fullName}
              placeholder="Full Name"
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, fullName: e.target.value })
              }
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
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, address1: e.target.value })
                  }
                  maxLength={100}
                  required
                />
                <FormInput
                  label="Address 2"
                  type="text"
                  value={profileInfo.address2}
                  placeholder="Address 2"
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, address2: e.target.value })
                  }
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
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, city: e.target.value })
                  }
                  maxLength={100}
                  required
                />
                <Dropdown
                  label="State"
                  value={profileInfo.state}
                  options={stateOptions}
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, state: e.target.value })
                  }
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
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, zipCode: e.target.value })
                }
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
                onChange={(selected) =>
                  setProfileInfo({ ...profileInfo, skills: selected })
                }
                required
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Preferences"
                value={profileInfo.preferences}
                placeholder="Enter your preferences"
                onChange={(e) =>
                  setProfileInfo({
                    ...profileInfo,
                    preferences: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-4">
              <MultiDatePicker
                label="Availability"
                value={profileInfo.availability}
                onChange={(selected) =>
                  setProfileInfo({ ...profileInfo, availability: selected })
                }
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-6 bg-orange text-white py-2 px-4 rounded-lg"
                onClick={handleSubmit}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;