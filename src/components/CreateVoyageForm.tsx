"use client"

import React, { FC, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { FormSchema } from "../types/form";
import { PORTS, VESSELS } from '../constants';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "~/components/ui/sheet";
import {
  Form
} from "~/components/ui/form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import Datetime from "~/components/Inputs/Datetime";
import Select from "~/components/Inputs/Select";

const FormSchema = z.object({
  departure: z.date({
    required_error: "A departure date is required.",
  }),
  arrival: z.date({
    required_error: "An arrival date is required.",
  }),
  portOfLoading: z.string({
    required_error: "A port of loading is required.",
  }).nonempty(),
  portOfDischarge: z.string({
    required_error: "A port of discharge is required.",
  }).nonempty(),
  vessel: z.string({
    required_error: "A vessel is required.",
  }).nonempty(),
});

interface Props {}

interface Voyage {
  departure: Date;
  arrival: Date;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: string;
}

const AddVoyageForm: FC<Props> = () => {
  const form = useForm<z.infer<typeof FormSchema>>({resolver: zodResolver(FormSchema)});

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values: Voyage) => {
      const response = await fetch('/api/voyage/create', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add the voyage");
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["voyages"]);
      },
    }
  );

  const [departureDT, setDepartureDT] = useState<Date>();
  const [arrivalDT, setArrivalDT] = useState<Date>();

  useEffect(() => {
    // UI Library doesn't quite support date + time so we have to manually set our value
    if(departureDT) form.setValue('departure', departureDT);
    if(arrivalDT) form.setValue('arrival', arrivalDT);

    if(departureDT && arrivalDT && departureDT?.getTime() > arrivalDT?.getTime()) {
      form.setError('arrival', { message: "Arrival date cannot be before departure date." });
    } else {
      form.clearErrors('arrival');
    }
  }, [departureDT, arrivalDT]);

  const handleSubmit = (values: z.infer<typeof FormSchema>) => {
    // https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-nextjs/src/app/create
    // validate & sanitize
    // departure data cannot be before arrival date
    // send to database
    // refresh list of voyages
    mutation.mutate(values);
    console.log('submit');
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="my-8" size="lg">Create</Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Datetime
              form={form}
              name="departure"
              label="Departure"
              setDatetime={setDepartureDT}
              placeholder="Choose a departure date and time"
            />

            <Datetime
              form={form}
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
              options={VESSELS}
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