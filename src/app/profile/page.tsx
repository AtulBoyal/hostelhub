import { createClient } from "@/lib/supabase/server";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import { Building2, Layers, DoorOpen, Award, Mail } from "lucide-react";
import { LogoutButton } from "./logout-button";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { user, profile } = await getCachedAuthUser();

  if (!user || !profile) {
    redirect(user ? '/onboarding' : '/login');
  }

  const hostelName = profile.hostels?.name || 'Unknown Hostel';
  const floorNumber = profile.floors?.floor_number || 'Unknown Floor';
  const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      
      {/* 1. HEADER */}
      <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
          Manage your HostelHub profile and resident information.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-3 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        
        {/* 2. PROFILE HERO CARD */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center">
            
            <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center overflow-hidden border border-blue-200 mb-4 shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-extrabold">{initials}</span>
              )}
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{profile.name}</h3>
            
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-2">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{profile.email}</span>
            </div>

          </div>
        </div>

        {/* 3. RESIDENT INFORMATION */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Resident Information</h2>
            </div>
            
            <div className="p-1">
              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl mx-1 my-1">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hostel</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{hostelName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl mx-1 my-1">
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Floor</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{floorNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl mx-1 my-1">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <DoorOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Room Number</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{profile.room_number || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. COMMUNITY STANDING (If applicable) */}
          {(profile.contribution_points || 0) > 0 && (
            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Community Standing</h2>
              </div>
              <div className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-tight">{profile.contribution_points}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Contribution Points</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. ACCOUNT ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account</h2>
            </div>
            <div className="p-5">
              <LogoutButton />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
