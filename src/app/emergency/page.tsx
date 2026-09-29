import { Phone, ShieldAlert, HeartPulse, Building2, ChevronRight } from "lucide-react";
import { getCachedAuthUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EmergencyPage() {
  const { user } = await getCachedAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  const urgentContacts = [
    { 
      id: 1, 
      title: "Ambulance / Medical", 
      number: "040-2301-6002", 
      icon: HeartPulse, 
      description: "Immediate medical emergencies",
      accent: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
      buttonBg: "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
    },
    { 
      id: 2, 
      title: "Hostel Security", 
      number: "040-2301-6001", 
      icon: ShieldAlert, 
      description: "24/7 security assistance",
      accent: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
      buttonBg: "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
    },
  ];

  const supportContacts = [
    { 
      id: 3, 
      title: "Hostel Warden", 
      number: "+91 98765 43210", 
      icon: Phone, 
      description: "Administrative support",
      accent: "text-slate-700",
      bg: "bg-slate-100",
      border: "border-slate-200",
      buttonBg: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
    },
    { 
      id: 4, 
      title: "Main Gate", 
      number: "040-2301-6000", 
      icon: Building2, 
      description: "Campus entry/exit",
      accent: "text-slate-700",
      bg: "bg-slate-100",
      border: "border-slate-200",
      buttonBg: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Emergency <span className="text-rose-600">&</span> Help</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium mx-auto md:mx-0">
          Quick access to important help and support.
        </p>
      </section>

      {/* 2. URGENT SECTION */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Urgent Assistance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {urgentContacts.map((contact) => (
            <div key={contact.id} className={`bg-white border ${contact.border} rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-rose-200 transition-all relative overflow-hidden flex flex-col justify-between group`}>
              <div className="flex items-start gap-4">
                <div className={`${contact.bg} p-3 rounded-full shrink-0 transition-colors`}>
                  <contact.icon className={`h-6 w-6 ${contact.accent}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{contact.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{contact.description}</p>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-slate-50">
                <a 
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`} 
                  className={`flex items-center justify-between w-full rounded-xl py-3 px-4 font-bold transition-colors ${contact.buttonBg}`}
                  aria-label={`Call ${contact.title}`}
                >
                  <span className="text-[15px] tracking-wide">{contact.number}</span>
                  <div className="flex items-center text-xs uppercase tracking-wider font-semibold">
                    Call
                    <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUPPORT SECTION */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both pt-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Hostel Support</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {supportContacts.map((contact) => (
            <div key={contact.id} className={`bg-white border ${contact.border} rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group`}>
              <div className="flex items-start gap-4">
                <div className={`${contact.bg} p-3 rounded-full shrink-0`}>
                  <contact.icon className={`h-5 w-5 ${contact.accent}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{contact.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{contact.description}</p>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-slate-50">
                <a 
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`} 
                  className={`flex items-center justify-between w-full rounded-xl py-3 px-4 font-bold transition-colors ${contact.buttonBg}`}
                  aria-label={`Call ${contact.title}`}
                >
                  <span className="text-[15px] tracking-wide">{contact.number}</span>
                  <div className="flex items-center text-xs uppercase tracking-wider font-semibold">
                    Call
                    <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUICK HELP / INFORMATIONAL */}
      <section className="mt-8 bg-slate-50 border border-slate-200 rounded-[24px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 fill-mode-both">
        <h3 className="text-base font-bold text-slate-900 mb-2">Need non-urgent maintenance?</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          If you have a broken fixture, Wi-Fi problem, or general hostel issue that does not require an immediate response, please use the standard <a href="/maintenance" className="font-bold text-slate-900 underline decoration-slate-300 hover:decoration-slate-900 transition-colors">Maintenance module</a> to file a ticket.
        </p>
      </section>

    </div>
  );
}
