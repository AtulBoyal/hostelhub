'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { signup } from '@/app/actions/auth';
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

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [hostels, setHostels] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchHostels() {
      const { data } = await supabase.from('hostels').select('*').order('name');
      if (data) setHostels(data);
    }
    fetchHostels();
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
    fetchFloors();
  }, [selectedHostel, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Hostel<span className="text-blue-600">Hub</span></span>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join your hostel community today.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{state.error}</p>
              </div>
            )}
            
            {state?.success && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                <p className="font-medium">{state.success}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m.example@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
              <p className="text-xs text-slate-500">Minimum 8 characters.</p>
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
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
