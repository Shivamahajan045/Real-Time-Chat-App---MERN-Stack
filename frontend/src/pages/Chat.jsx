import { ChatState } from "../Context/ChatProvider";

import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import SingleChat from "@/components/SingleChat";
import { useState } from "react";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        w="100%"
        h="91.5vh"
        p="10px"
        justifyContent={"space-between"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
