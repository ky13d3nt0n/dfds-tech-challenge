'use client'

import React, { type FC } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '~/components/ui/form';
import { Checkbox } from '~/components/ui/checkbox';
import type { Control, FieldPath } from 'react-hook-form';
import type { Voyage } from '~/components/CreateVoyageForm';
interface Item {
  id: string;
  name: string;
}
interface Props {
  control: Control<Voyage>;
  name: FieldPath<Voyage>;
  label: string;
  placeholder?: string;
  items: Item[];
}
const CheckboxInput: FC<Props> = ({
  control,
  name,
  label,
  placeholder = 'Select an option',
  items
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="mb-8 flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormDescription>
            {placeholder}
          </FormDescription>

          {items.map((item) => (
            <FormField
              key={item.id}
              control={control}
              name={name}
              render={({field}) => (
                  <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={(field.value as string[])?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value as string[]), item.id])
                            : field.onChange((field.value as string[])?.filter((value) => value !== item.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{item.name}</FormLabel>
                  </FormItem>
              )}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

CheckboxInput.displayName = 'CheckboxInput';

export default CheckboxInput;
