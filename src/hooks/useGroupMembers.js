import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";

const useGroupMembers = (groupId) => {
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const membersResponse = await api.get(`/groups/${groupId}/guests`, {
          headers,
        });

        setGroup(groupResponse.data);
        setUsers(membersResponse.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the group and its members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the group and its members! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  return { group, users };
};

export default useGroupMembers;
