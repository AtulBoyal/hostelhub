'use client';

import { useActionState, useEffect, useState } from 'react';
import { submitOnboarding } from '@/app/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const initialState = {
  error: '',
};

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(submitOnboarding, initialState);
  const [hostels, setHostels] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [defaultName, setDefaultName] = useState('');
  
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      
      if (user.user_metadata?.full_name) {
        setDefaultName(user.user_metadata.full_name);
      }
      
      const { data: hostelData } = await supabase.from('hostels').select('*').order('name');
      if (hostelData) {
        setHostels(hostelData);
        // If Ramanujan is the only hostel, we can auto-select it or just let them select.
        // But to avoid uncontrolled warnings, we just let it load first.
      }
      
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  useEffect(() => {
    async function fetchFloors() {
      if (!selectedHostel) {
        setFloors([]);
        return;
      }
      const { data } = await supabase.from('floors').select('*').eq('hostel_id', selectedHostel).order('floor_number');
      if (data) setFloors(data);
    }
    if (!isLoading) {
      fetchFloors();
    }
  }, [selectedHostel, supabase, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex justify-center p-10">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Hostel<span className="text-blue-600">Hub</span></span>
          </div>
          <CardTitle className="text-2xl">Complete your profile</CardTitle>
          <CardDescription>Just a few more details to get started.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{state.error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={defaultName} placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel_id">Hostel</Label>
              <Select name="hostel_id" onValueChange={(val: string | null) => {
                setSelectedHostel(val || '');
                setSelectedFloor('');
              }} required>
                <SelectTrigger>
                  {selectedHostel 
                    ? hostels.find(h => h.id === selectedHostel)?.name 
                    : <span className="text-muted-foreground">Select your hostel</span>}
                </SelectTrigger>
                <SelectContent>
                  {hostels.map(hostel => (
                    <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor_id">Floor</Label>
                <Select name="floor_id" onValueChange={(val: string | null) => setSelectedFloor(val || '')} disabled={!selectedHostel} required>
                  <SelectTrigger>
                    {selectedFloor 
                      ? `Floor ${floors.find(f => f.id === selectedFloor)?.floor_number}`
                      : <span className="text-muted-foreground">Select floor</span>}
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map(floor => (
                      <SelectItem key={floor.id} value={floor.id}>Floor {floor.floor_number}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" name="room_number" placeholder="e.g. 312" required />
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving profile...' : 'Complete Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
