import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Head from 'next/head';
import Layout from '~/components/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { fetchData } from '~/utils';
import type { ReturnType } from './api/voyage/getAll';
import { Button } from '~/components/ui/button';
import { TABLE_DATE_FORMAT } from '~/constants';
import CreateVoyageForm from '~/components/CreateVoyageForm';
import { Toaster } from '~/components/ui/toaster';
import { ToastAction } from '~/components/ui/toast'
import { useToast } from '~/components/ui/use-toast';

export default function Home() {
  const { toast } = useToast();
  const { data: voyages } = useQuery<ReturnType>(['voyages'], () => fetchData('voyage/getAll'));
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the voyage');
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['voyages']);
      },
      onError: (err: Error) => {
        toast({
          variant: 'destructive',
          title: 'Uh-oh!',
          description: err?.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      }
    }
  );

  const handleDelete = (voyageId: string) => mutation.mutate(voyageId);

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout columns={false}>
        <CreateVoyageForm />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  {voyage.unitTypes.length > 0 ?
                    <Popover>
                      <PopoverTrigger>
                        {voyage.unitTypes.length}
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Unit Types</h4>
                            <p className="text-sm text-muted-foreground">
                              Detailed list of unit types.
                            </p>
                          </div>
                          <div className="grid gap-2">
                              <div className="flex justify-between gap-4 border-b-2 py-2 mb-4">
                                <span>Name</span> <span>Default Length</span>
                              </div>
                            {voyage.unitTypes.map((unitType, index) => (
                              <div key={index} className="flex justify-between gap-4">
                                <span>{unitType.name}</span> <span>{unitType.defaultLength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover> :
                    '-' }
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
      <Toaster/>
    </>
  );
}
