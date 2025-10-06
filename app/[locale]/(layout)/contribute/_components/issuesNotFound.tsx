import { Typography } from "@components/DS/typography";
import { FileQuestionMark } from "lucide-react";

const IssuesNotFound = () => {
  return (
    <div className="col-span-full flex h-143 flex-col items-center justify-center gap-4">
      <FileQuestionMark className="size-20" />
      <Typography variant="p">Not found</Typography>
    </div>
  );
};

export default IssuesNotFound;
