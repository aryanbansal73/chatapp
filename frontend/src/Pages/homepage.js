import React, { useEffect } from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from "../components/Authentication/login.js"; // Corrected component name to "Login"
import Signup from '../components/Authentication/signup.js'; // Corrected component name to "Signup"
import { useHistory } from 'react-router-dom';

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user);
    // if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work sans' color='black' justifyContent='center'>
          Splitzy-Login
        </Text>
      </Box>
      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        borderWidth='1px'
        color='black'
      >
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login /> {/* Corrected to use the "Login" component */}
            </TabPanel>
            <TabPanel>
              <Signup /> {/* Corrected to use the "Signup" component */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;