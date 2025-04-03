import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User } from "@prisma/client";

const useCurrentUser = () => {
  const session = useSession();

  const currentUser = useMemo(() => {
    if (!session?.data?.user?.email) return null;

    return session?.data?.user?.email || null;
  }, [session?.data?.user?.email]);

  return currentUser;
};

export default useCurrentUser;
