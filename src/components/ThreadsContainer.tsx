interface Props {
  isNextPage: boolean;
  totalThreadsCount: number;
  children: React.ReactNode | null;
}

function ThreadsContainer({ isNextPage, totalThreadsCount, children }: Props) {
  return <div className="threads flex flex-col p-3">{children}</div>;
}

export default ThreadsContainer;
