'use client'

import React, { type FC, useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '~/components/ui/calendar';
import { format, toDate } from 'date-fns';
import type { Control, FieldPath } from 'react-hook-form';
import type { Voyage } from '~/components/CreateVoyageForm';

interface Props {
  control: Control<Voyage>;
  name: FieldPath<Voyage>;
  label: string;
  placeholder?: string;
  defaultTime?: string;
  setDatetime: (value: Date) => void;
}

const DatetimePicker: FC<Props> = ({
  control,
  name,
  label,
  placeholder = 'Pick a date',
  defaultTime = '15:00',
  setDatetime
}) => {
  const [selected, setSelected] = useState<Date>();
  const [timeValue, setTimeValue] = useState<string>(defaultTime);

  useEffect(() => {
    if(!selected) return;
    setDatetime(toDate(selected));
  }, [selected, timeValue, setDatetime]);

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!selected) {
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
    if(Number.isNaN(hours) || Number.isNaN(minutes) ) return;
    const newSelectedDate = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      hours,
      minutes
    );
    setSelected(newSelectedDate);
    setTimeValue(time);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      setSelected(date);
      return;
    }
    const [hours, minutes] = timeValue
      .split(':')
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
    setSelected(newDate);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="mb-8 flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline">
                  {selected ? (
                    format(new Date(selected), 'dd/MM/yyyy HH:mm')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={handleDaySelect}
                disabled={(date) => date <= new Date() || date < new Date('1900-01-01')}
                footer={
                  <p>
                    Pick a time:{' '}
                    <input
                      type="time"
                      className="my-2 bg-transparent"
                      value={timeValue}
                      onChange={handleTimeChange}
                    />
                  </p>
                }
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

DatetimePicker.displayName = 'DatetimePicker';

export default DatetimePicker;
