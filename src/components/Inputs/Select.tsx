"use client"

import React, { FC } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";

interface Props {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: string[];
}
const SelectInput: FC<Props> = ({
  control,
  name,
  label,
  placeholder = 'Select an option',
  options
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className="mb-8">
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

SelectInput.displayName = 'SelectInput';

export default SelectInput;
