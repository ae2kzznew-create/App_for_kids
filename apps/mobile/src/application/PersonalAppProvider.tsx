import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { PersonalService } from "../domain/personalService";
import { useDatabase } from "../storage/DatabaseProvider";
import { SQLitePersonalRepository } from "../storage/sqliteRepository";

interface PersonalAppContextValue {
  repository: SQLitePersonalRepository;
  service: PersonalService;
  revision: number;
  refresh: () => void;
}

const PersonalAppContext = createContext<PersonalAppContextValue | null>(null);

export function PersonalAppProvider({ children }: { children: ReactNode }) {
  const database = useDatabase();
  const repository = useMemo(() => new SQLitePersonalRepository(database), [database]);
  const service = useMemo(() => new PersonalService(repository), [repository]);
  const [revision, setRevision] = useState(0);

  const value = useMemo(
    () => ({ repository, service, revision, refresh: () => setRevision((current) => current + 1) }),
    [repository, service, revision],
  );

  return <PersonalAppContext.Provider value={value}>{children}</PersonalAppContext.Provider>;
}

export function usePersonalApp() {
  const value = useContext(PersonalAppContext);
  if (!value) throw new Error("usePersonalApp must be used inside PersonalAppProvider");
  return value;
}
