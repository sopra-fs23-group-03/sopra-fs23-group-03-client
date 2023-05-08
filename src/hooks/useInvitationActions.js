import { useHistory } from "react-router-dom";
import { api } from "helpers/api";

const useInvitationActions = () => {
  const history = useHistory();
  const headers = {
    "X-Token": localStorage.getItem("token"),
  };
  const guestId = localStorage.getItem("userId");

  const handleAcceptInvitation = async (groupId) => {
    try {
      await api.put(
        `/groups/${groupId}/invitations/accept`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
      history.push(`/groupforming/${groupId}/guest`);
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
