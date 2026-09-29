import { Phone, ShieldAlert, HeartPulse, Building2, ChevronRight } from "lucide-react";

export const dynamic = 'force-static';

export default function EmergencyPage() {
  const urgentContacts = [
    { 
      id: 1, 
      title: "Ambulance / Medical", 
      number: "040-2301-6002", 
      icon: HeartPulse, 
      description: "For immediate medical emergencies",
      accent: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    { 
      id: 2, 
      title: "Hostel Security", 
      number: "040-2301-6001", 
      icon: ShieldAlert, 
      description: "Available 24/7 for security issues",
      accent: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
  ];

  const supportContacts = [
    { 
      id: 3, 
      title: "Hostel Warden", 
      number: "+91 98765 43210", 
      icon: Phone, 
      description: "For urgent administrative hostel support",
      accent: "text-slate-900",
      bg: "bg-slate-100",
      border: "border-slate-200"
    },
    { 
      id: 4, 
      title: "Main Gate", 
      number: "040-2301-6000", 
      icon: Building2, 
      description: "Campus entry/exit assistance",
      accent: "text-slate-900",
      bg: "bg-slate-100",
      border: "border-slate-200"
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER */}
      <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Emergency & Help</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl font-medium">
          Quick access to important help and support.
        </p>
      </section>

      {/* 2. URGENT SECTION */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
        <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 ml-1">Urgent Assistance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {urgentContacts.map((contact) => (
            <div key={contact.id} className={`bg-white border ${contact.border} rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between`}>
              <div className="flex items-start gap-4">
                <div className={`${contact.bg} p-4 rounded-full shrink-0`}>
                  <contact.icon className={`h-7 w-7 ${contact.accent}`} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{contact.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{contact.description}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-100">
                <a 
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`} 
                  className="flex items-center justify-between w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3.5 px-5 font-bold transition-colors shadow-sm group"
                  aria-label={`Call ${contact.title}`}
                >
                  <span className="text-lg">{contact.number}</span>
                  <div className="flex items-center text-sm uppercase tracking-wider opacity-90 group-hover:opacity-100">
                    Call Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUPPORT SECTION */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Hostel Support</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {supportContacts.map((contact) => (
            <div key={contact.id} className={`bg-white border ${contact.border} rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between`}>
              <div className="flex items-start gap-4">
                <div className={`${contact.bg} p-3.5 rounded-full shrink-0`}>
                  <contact.icon className={`h-6 w-6 ${contact.accent}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{contact.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{contact.description}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-100">
                <a 
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`} 
                  className="flex items-center justify-between w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-5 font-bold transition-colors shadow-sm group"
                  aria-label={`Call ${contact.title}`}
                >
                  <span className="text-base">{contact.number}</span>
                  <div className="flex items-center text-xs uppercase tracking-wider opacity-90 group-hover:opacity-100">
                    Call Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUICK HELP / INFORMATIONAL */}
      <section className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 fill-mode-both">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Need non-urgent maintenance?</h3>
        <p className="text-blue-800 text-sm md:text-base leading-relaxed max-w-xl">
          If you have a broken fixture, Wi-Fi problem, or general hostel issue that does not require an immediate response, please use the standard <a href="/maintenance" className="font-bold underline decoration-blue-300 hover:decoration-blue-900 transition-colors">Maintenance</a> module to file a ticket.
        </p>
      </section>

    </div>
  );
}
