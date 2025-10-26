"use client";
import { useEffect, useState } from "react";
import getUsers from "@/services/getUsers";
export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const data = await getUsers();
      setUsers(data);
    })();
  }, []);
  return (
    <div>
      {users.map((item) => {
        return (
          <div key={item.id}>
            <p>{item.street}</p>
          </div>
        );
      })}
    </div>
  );
}
