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
          className="h-13 w-full animate-pulse rounded-md bg-white/10 xl:w-55"
        />
      ))}
    </>
  );
};

export default IssueSearchButtonFallback;
