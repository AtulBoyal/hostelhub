import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <div className="bg-slate-100 p-4 rounded-full">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Signing you in...</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please wait while we finish setting up your account.</p>
        </div>
      </div>
    </div>
  )
}
