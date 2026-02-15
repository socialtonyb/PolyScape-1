import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { OsrsButton } from "@/components/OsrsButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[hsl(var(--background))]">
      <Card className="w-full max-w-md mx-4 osrs-panel">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-display text-[#ffd700]">404 Not Found</h1>
          </div>
          <p className="mt-4 text-[#d6c3a1] text-lg">
            You seem to have wandered into the Wilderness. This page does not exist.
          </p>

          <div className="mt-8">
            <Link href="/">
              <OsrsButton className="w-full">Teleport Home</OsrsButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
