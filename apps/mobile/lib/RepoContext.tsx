import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Repo {
  owner: string;
  repo: string;
}

interface RepoContextValue {
  repos: Repo[];
  addRepo: (owner: string, repo: string) => void;
  removeRepo: (owner: string, repo: string) => void;
}

const RepoContext = createContext<RepoContextValue>({
  repos: [],
  addRepo: () => {},
  removeRepo: () => {},
});

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repo[]>([]);

  const addRepo = useCallback((owner: string, repo: string) => {
    setRepos((prev) => {
      if (prev.some((r) => r.owner === owner && r.repo === repo)) return prev;
      return [...prev, { owner, repo }];
    });
  }, []);

  const removeRepo = useCallback((owner: string, repo: string) => {
    setRepos((prev) => prev.filter((r) => !(r.owner === owner && r.repo === repo)));
  }, []);

  return (
    <RepoContext.Provider value={{ repos, addRepo, removeRepo }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepos() {
  return useContext(RepoContext);
}
