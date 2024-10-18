'use client';

import { useState, useEffect } from 'react';
import { FormInput } from '@/components/FormInput';
import { Dropdown } from '@/components/Dropdown';
import { TextArea } from '@/components/TextArea';
import { SingleDatePicker } from '@/components/DatePicker';
import { MultiSelectDropdown } from '@/components/MultiSelectDropdown';
import { event } from '@/types/types';
import { skillOptions, urgencyOptions } from '@/data/data';
import supabase from '@/api/supabaseClient';

interface EventFormProps {
  event?: event | null;
  onFormSubmit: () => void;  // To notify parent component after form submission
}

export default function EventForm({ event, onFormSubmit }: EventFormProps) {
  const [manageInfo, setManageInfo] = useState<event>({
    id: 0,
    event_name: '',
    event_description: '',
    location: '',
    required_skills: [],
    urgency: '',
    event_date: new Date(),
  });

  useEffect(() => {
    if (event) {
      setManageInfo({
        ...event,
        event_date: new Date(event.event_date),
      });
    } else {
      setManageInfo({
        id: 0,
        event_name: '',
        event_description: '',
        location: '',
        required_skills: [],
        urgency: '',
        event_date: new Date(),
      });
    }
  }, [event]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (manageInfo.id !== 0) {
        // Updating an existing event
        const { error } = await supabase
          .from('events')
          .update({
            event_name: manageInfo.event_name,
            event_description: manageInfo.event_description,
            location: manageInfo.location,
            required_skills: manageInfo.required_skills,
            urgency: manageInfo.urgency,
            event_date: manageInfo.event_date.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', manageInfo.id);

        if (error) {
          console.error('Error updating event:', error);
          alert('Error updating event. Please try again.');
        } else {
          alert('Event updated successfully!');
        }
      } else {
        // Inserting a new event
        const { error } = await supabase
          .from('events')
          .insert([
            {
              event_name: manageInfo.event_name,
              event_description: manageInfo.event_description,
              location: manageInfo.location,
              required_skills: manageInfo.required_skills,
              urgency: manageInfo.urgency,
              event_date: manageInfo.event_date.toISOString(),
            },
          ]);

        if (error) {
          console.error('Error creating event:', error);
          alert('Error creating event. Please try again.');
        } else {
          alert('Event created successfully!');
        }
      }

      // Reset form after submission
      setManageInfo({
        id: 0,
        event_name: '',
        event_description: '',
        location: '',
        required_skills: [],
        urgency: '',
        event_date: new Date(),
      });

      onFormSubmit(); // Notify parent component that the form has been submitted

    } catch (error) {
      console.error('Error submitting event:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col w-full">
        <form className="w-full text-sm text-black p-4 mb-4 rounded-xl bg-white rounded-tl-none" onSubmit={handleSubmit}>
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
              selectedOptions={manageInfo.required_skills.map((skill) => {
                const skillOption = skillOptions.find((option) => option.value === skill);
                return { value: skill, label: skillOption ? skillOption.label : skill };
              })}
              onChange={(selected) =>
                setManageInfo({ ...manageInfo, required_skills: selected.map((option) => option.value) })
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
          <div className="mt-4">
            <SingleDatePicker
              label="Event Date"
              value={manageInfo.event_date}
              onChange={(selected) =>
                setManageInfo({ ...manageInfo, event_date: selected || new Date() })
              }
              required
            />
          </div>
          <div className="flex mt-6 justify-end">
            <button
              type="submit"
              className="bg-orange text-white py-2 px-4 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (manageInfo.id !== 0 ? 'Updating Event...' : 'Creating Event...') : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
