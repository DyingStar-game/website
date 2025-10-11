import { DialogComponent } from "@feat/dialog-manager/dialogComponent";
import { useDialogStore } from "@feat/dialog-manager/dialogStore";

export const DialogManagerRenderer = () => {
  const activeDialog = useDialogStore((state) => state.activeDialog);

  if (activeDialog) {
    return <DialogComponent dialog={activeDialog} />;
  }

  return null;
};
