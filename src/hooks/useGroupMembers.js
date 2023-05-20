import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";

const useGroupMembers = (groupId) => {
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState(null);
  const [groupExists, setGroupExists] = useState(true); // Track if the group exists

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
        //if useGroupMembers(groupId); returns a 404 error, then the group does not exist and the user should be redirected to the dashboard

        if (error.response && error.response.status === 404) {
          // Group not found
          setGroupExists(false);
          console.error(
            `The group with id ${groupId} does not exist! Redirecting to dashboard...`
          );
        } else {
          alert(
            `Something went wrong while fetching the group and its members: \n${handleError(
              error
            )}`
          );
          console.error("Details:", error);
        }
      }
    }

    fetchData();
  }, []);

  return { group, users };
};

export default useGroupMembers;
