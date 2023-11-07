import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import Mychats  from "../components/Mychats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  console.log(user) ;
  return (
    <div style={{ width: "100%" }}>
    { user && <SideDrawer />}
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user &&  <Mychats  fetchAgain={fetchAgain}  />}
      {user && ( <ChatBox fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} /> )}
    </Box>
  </div>
  );
};

export default Chatpage;