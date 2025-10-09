type IssueSearchButtonFallbackProps = {
  count?: number;
};

const IssueSearchButtonFallback = ({
  count = 3,
}: IssueSearchButtonFallbackProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-13 w-55 animate-pulse rounded-md bg-white/10"
        />
      ))}
    </>
  );
};

export default IssueSearchButtonFallback;
