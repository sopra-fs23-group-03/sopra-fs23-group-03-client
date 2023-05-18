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
        setUsers(membersResponse.data || []);
      } catch (error) {
        alert(
          `Something went wrong while fetching the group and its members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);

      }
    }

    fetchData(); // Call once on component mount

    const intervalId = setInterval(() => {
      fetchData(); // Call again after the specified interval
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, []); // Only run once on component mount

  return { group, users };
};

export default useGroupMembers;
