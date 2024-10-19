"use client";
import React from "react";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "./actions";
import { FormInput } from "@/components/FormInput";
import { Dropdown } from "@/components/Dropdown";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { TextArea } from "@/components/TextArea";
import { Option } from "@/components/MultiSelectDropdown";
import { MultiDatePicker } from "@/components/MultiDatePicker";
import supabase from '@/api/supabaseClient';
import { Session } from "@supabase/supabase-js";
import { profile } from "@/types/types";
import { stateOptions, skillOptions } from "@/data/data";

interface ProfileProps {
  session: Session | null;
}

export default function Profile({ session }: ProfileProps) {
  const [profileData, setProfileData] = useState<profile | null>(null);
  const [profileInfo, setProfileInfo] = useState<profile>({
    id: undefined,
    email: "",
    full_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip_code: "",
    skills: [],
    preferences: "",
    availability: [],
    is_admin: false,
  });

  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.email) {
        const data = await fetchUserProfile(session.user.email);
        setProfileData(data);
      }
    }

    loadProfile();
  }, [session]);

  useEffect(() => {
    let mappedSkills: Option[] = [];
    if (profileData) {
      if (profileData.skills !== null && profileData.skills !== undefined) {
        mappedSkills = (profileData.skills as unknown as string[]).map((skillValue: string) =>
          skillOptions.find((option) => option.value === skillValue)
        ).filter(Boolean) as Option[];
      }
      const transformedAvailability = (profileData.availability as unknown as string[])?.map((date: string) => new Date(date + 'T00:00:00'));

      setProfileInfo({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name || "",
        address_1: profileData.address_1 || "",
        address_2: profileData.address_2 || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zip_code: profileData.zip_code || "",
        skills: profileData.skills || [],
        preferences: profileData.preferences || "",
        availability: transformedAvailability || [],
        is_admin: profileData.is_admin,
      });
    }
  }, [profileData]);
  
  const validateProfile = () => {
    const errors: string[] = [];

    if (profileInfo.full_name.length > 50) {
      errors.push('Full Name must not exceed 50 characters.');
    }
    if (profileInfo.address_1.length > 100) {
      errors.push('Address 1 must not exceed 100 characters.');
    }
    if (profileInfo.city.length > 100) {
      errors.push('City must not exceed 100 characters.');
    }
    if (profileInfo.zip_code.length < 5 || profileInfo.zip_code.length > 9) {
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

  const handleSubmit = async () => {
    const errors = validateProfile();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileInfo.full_name,
          address_1: profileInfo.address_1,
          address_2: profileInfo.address_2,
          city: profileInfo.city,
          state: profileInfo.state,
          zip_code: profileInfo.zip_code,
          skills: profileInfo.skills,
          preferences: profileInfo.preferences,
          availability: profileInfo.availability.map((date) => date.toISOString()),
        })
        .eq("email", profileInfo.email);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again later.");
      } else {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("An error occurred. Please try again later.");
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
              value={profileInfo.full_name}
              placeholder="Full Name"
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, full_name: e.target.value })
              }
              maxLength={50}
              required
            />
            <div className="mt-4">
              <div className="flex w-full justify-between gap-x-4">
                <FormInput
                  label="Address 1"
                  type="text"
                  value={profileInfo.address_1}
                  placeholder="Address 1"
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, address_1: e.target.value })
                  }
                  maxLength={100}
                  required
                />
                <FormInput
                  label="Address 2"
                  type="text"
                  value={profileInfo.address_2}
                  placeholder="Address 2"
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, address_2: e.target.value })
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
                value={profileInfo.zip_code}
                placeholder="Zip Code"
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, zip_code: e.target.value })
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
                selectedOptions={profileInfo.skills.map(skill => skillOptions.find(option => option.value === skill) as Option)}
                onChange={(selected) =>
                  setProfileInfo({ ...profileInfo, skills: selected.map(option => option.value) })
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
                onSubmit={handleSubmit}
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