import { LINKS } from "@feat/navigation/Links";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl">Page Not Found</CardTitle>
        <CardDescription>
          The page you're looking for doesn't exist or you don't have access to
          it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="mb-2 font-medium">What might have happened?</p>
          <p className="text-muted-foreground">
            The page may have been moved, deleted, or you might have mistyped
            the URL. If you believe you should have access to this resource,
            please contact your administrator.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <Button asChild variant="default">
          <Link href={LINKS.Landing.Landing.href()}>Return to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
