import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
const SingleChat = ({fetchAgain  , setFetchAgain}) => {
    const toast = useToast() ;
    const {user , selectedChat , setSelectedChat} = ChatState(); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const fetchMessages = async()=>{
        if(!selectedChat)return ; 
        try{
            const config = {
                headers:{
                   Authorization :`Bearer ${user.token}`,
                },

            }
            setLoading(true);
            const {data} = await axios.get(`/api/message/${selectedChat._id}` , config
            );
            console.log(messages) ;
            setMessages(data) ;
            setLoading(false);
        }
        catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }
    useEffect(()=>{
        fetchMessages() ;
    } , [selectedChat]);
    const sendMessage= async(e)=>{
        if(e.key ==="Enter" && newMessage){
            try{
                const config = {
                    headers:{
                       "Content-Type" : 'application/json',
                       Authorization :`Bearer ${user.token}`,
                    },

                }
                setNewMessage("");
                const {data} = await axios.post('/api/message' , {
                    content : newMessage,
                    chatId:selectedChat._id,
                },
                config
                );
                console.log(data);
                setMessages([...messages ,data]) ;
            }
            catch(error){
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
        }
    };
    const typingHandler = (e)=>{
        setNewMessage(e.target.value);
    };
  
  
    return (
        <>
            {selectedChat?(
                <>  
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                        d={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                            {getSender(user, selectedChat.users)} 
                            <ProfileModal user ={getSenderFull(user, selectedChat.users)}  />
                            </>
                        ):(
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                    {loading?(
                        <Spinner
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        />
                    ):
                    (
                        <div  className='messages'>

                        </div>
                    )
                    }
                    <FormControl onKeyDown={sendMessage} isRequired mt={4}>
                        <Input
                        variant={"filled"}
                        bg = "#E0E0E0"
                        placeholder='Enter the Message......'
                        onChange={typingHandler}
                        value = {newMessage}
                        >
                        
                        </Input>
                    </FormControl>
                    </Box>
                </>
            ):
            (
                <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
                </Box>
            )


            }
        
        </>
    )
}

export default SingleChat
