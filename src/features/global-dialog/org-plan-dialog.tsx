import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { closeGlobalDialog } from "./global-dialog.store";

export const OrgPlanDialog = () => {
  return (
    <Dialog open={true} onOpenChange={() => closeGlobalDialog()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto px-8 py-6 lg:px-16 lg:py-14">
        <DialogHeader className="w-full text-center">
          <DialogTitle className="text-center font-bold lg:text-3xl">
            Choose a plan and start growing
          </DialogTitle>
          <DialogDescription className="text-center">
            To unlock full access to our features, choose a plan and start
            growing your business.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
