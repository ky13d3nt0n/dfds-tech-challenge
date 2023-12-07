'use client'

import React, { type FC, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '~/components/ui/button';
import { fetchData } from '~/utils';
import type { ReturnType } from '../pages/api/vessel/getAll';
import { PORTS } from '../constants';
import { useToast } from '~/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '~/components/ui/sheet';
import {
  Form
} from '~/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Datetime from '~/components/Inputs/Datetime';
import Select from '~/components/Inputs/Select';
import Checkbox from '~/components/Inputs/Checkbox';

export const FormSchema = z.object({
  departure: z.date({
    required_error: 'A departure date is required.',
  }),
  arrival: z.date({
    required_error: 'An arrival date is required.',
  }),
  portOfLoading: z.string({
    required_error: 'A port of loading is required.',
  }).nonempty(),
  portOfDischarge: z.string({
    required_error: 'A port of discharge is required.',
  }).nonempty(),
  vessel: z.string({
    required_error: 'A vessel is required.',
  }).nonempty(),
  unitTypes: z.string().array().min(5, { message: 'Select a minimum of 5 unit types.'})
});

export type Voyage = {
  departure: Date;
  arrival: Date;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: string;
  unitTypes: string[];
}

const AddVoyageForm: FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [departureDT, setDepartureDT] = useState<Date>();
  const [arrivalDT, setArrivalDT] = useState<Date>();
  const { data: vessels } = useQuery<ReturnType>(['vessels'], () => fetchData('vessel/getAll'));
  const { data: unitTypes } = useQuery<ReturnType>(['unitTypes'], () => fetchData('unitType/getAll'));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      unitTypes: [],
    }
  });

  const mutation = useMutation(
    async (values: Voyage) => {
      const response = await fetch('/api/voyage/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to add the voyage');
      }
    },
    {
      onSuccess: async () => {
        // Close our sheet
        setOpen(false);

        // Show toast notification
        toast({
          title: 'Success!',
          description: 'Voyage created successfully.'
        });

        // Clear out old form values just in case.
        form.reset();

        // Invalidate queries so we can refetch them.
        await queryClient.invalidateQueries(['vessels']);
        await queryClient.invalidateQueries(['unitTypes']);

        // Refetch voyages so it shows in our voyages table.
        await queryClient.refetchQueries(['voyages']);
      },
    }
  );
  const handleCreate = (values: z.infer<typeof FormSchema>) => mutation.mutate(values);

  useEffect(() => {
    // UI Library doesn't quite support date + time field so we have to manually set our values and validation.
    // Followed react-day-picker implementation: https://react-day-picker.js.org/guides/input-fields#example-time-selection
    if(departureDT) {
      form.setValue('departure', departureDT);
      form.clearErrors('departure');
    }
    if(arrivalDT) form.setValue('arrival', arrivalDT);

    // Validate that arrival date is not before departure date.
    if(departureDT && arrivalDT && departureDT?.getTime() > arrivalDT?.getTime()) {
      form.setError('arrival', { message: 'Arrival date cannot be before departure date.' });
    } else {
      form.clearErrors('arrival');
    }
  }, [departureDT, arrivalDT, form]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="my-8" size="lg">Create</Button>
      </SheetTrigger>
      <SheetContent className="overflow-scroll">
        <Form {...form}>
          <form onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(handleCreate);
            }
          }>
            <Datetime
              control={form.control}
              name="departure"
              label="Departure"
              setDatetime={setDepartureDT}
              placeholder="Choose a departure date and time"
            />

            <Datetime
              control={form.control}
              name="arrival"
              label="Arrival"
              setDatetime={setArrivalDT}
              placeholder="Choose an arrival date and time"
              defaultTime="09:00"
            />

            <Select
              control={form.control}
              name="portOfLoading"
              label="Port of Loading"
              placeholder="Select a loading port"
              options={PORTS}
            />

            <Select
              control={form.control}
              name="portOfDischarge"
              label="Port of Discharge"
              placeholder="Select a discharge port"
              options={PORTS}
            />

            <Select
              control={form.control}
              name="vessel"
              label="Vessel"
              placeholder="Select a vessel"
              options={vessels ?? []}
            />

            <Checkbox
              control={form.control}
              name="unitTypes"
              label="Unit Types"
              placeholder="Select unit types (minimum of 5)"
              items={unitTypes ?? []}
            />

            <Button type="submit" size="lg">Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

AddVoyageForm.displayName = 'AddVoyageForm';

export default AddVoyageForm;
