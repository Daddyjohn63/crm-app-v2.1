import { Loader2 } from 'lucide-react'; // or any other spinner icon you prefer

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-9 flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
