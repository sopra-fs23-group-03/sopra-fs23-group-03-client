import { useHistory } from "react-router-dom";
import { api } from "helpers/api";

const useInvitationActions = () => {
  const history = useHistory();
  const headers = {
    "X-Token": localStorage.getItem("token"),
  };
  const guestId = localStorage.getItem("userId");

  const handleAcceptInvitation = async (groupId) => {
    console.log("groupId", groupId);
    try {
      await api.put(
        `/groups/${groupId}/invitations/accept`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
      localStorage.setItem("groupId", groupId);
      history.push(`/groupforming/${groupId}/guest`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectInvitation = async (groupId) => {
    try {
      await api.put(
        `/groups/${groupId}/invitations/reject`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
      history.push("/game");
    } catch (error) {
      console.error(error);
    }
  };

  return { handleAcceptInvitation, handleRejectInvitation };
};

export default useInvitationActions;
