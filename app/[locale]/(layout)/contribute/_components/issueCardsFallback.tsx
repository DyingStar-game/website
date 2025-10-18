type IssueCardsFallbackProps = {
  count?: number;
};

export const IssueCardsFallback = ({ count = 3 }: IssueCardsFallbackProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-143 animate-pulse rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%"
        />
      ))}
    </>
  );
};
