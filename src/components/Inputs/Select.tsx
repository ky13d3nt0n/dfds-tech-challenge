'use client'

import React, { type FC } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import type { Control, FieldPath } from 'react-hook-form';
import type { Voyage } from '~/components/CreateVoyageForm';
interface Option {
  id: string;
  name: string;
}
interface Props {
  control: Control<Voyage>;
  name: FieldPath<Voyage>;
  label: string;
  placeholder?: string;
  options: Option[];
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
          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={option.id}>{option.name}</SelectItem>
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
