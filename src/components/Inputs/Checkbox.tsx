"use client"

import React, { FC } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";

interface Item {
  id: string;
  name: string;
}
interface Props {
  control: any;
  name: string;
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
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(field.value?.filter((value:string) => value !== item.id))
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
