import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom"
const Signup = () => {

  const [name,setName] =  useState();
  const [email,setEmail] =  useState();
  const [password,setpassword] =  useState();
  const [confirmpassword,setconfirmpassword] =  useState();
  const [pic,setPic] =  useState();
  const [show,setShow] =  useState(false);
  const [showconfirm,setShowConfirm] =  useState(false);
  const [loading , setloading] = useState(false) ; 
  const toast = useToast()
  const history = useHistory() ;
  const handleClickConfirm = ()=>setShowConfirm(!showconfirm) ;
  const handleClick = ()=>setShow(!show) ;
  const postDetails = (pic)=>{
    setloading(true) ; 
    if(pic===undefined){
        toast({
            title:"Please select an image" , 
            status:"warning" ,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
        return ; 
    }
    if(pic.type ==="image/jpeg"||pic.type ==="image/png"){
        const data = new FormData() ; 
        data.append('file' , pic) ; 
        data.append('upload_preset' , 'chatapp');
        data.append('cload_name' , 'dsenflezu') ;
        fetch('https://api.cloudinary.com/v1_1/dsenflezu/image/upload' , {
            method:'post' , 
            body :data,
        })
        .then((res) =>res.json()) 
        .then((data)=>{
            setPic(data.url.toString()) ;
            setloading(false) ;
            console.log(data.url) ;
        })
        .catch((err)=>{
            console.log(err) ;
            setloading(false) ;
        });
        
    }
    else{
        toast({
            title:"Please select an image" , 
            status:"warning" ,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
        setloading(false) ;
        return ; 
    }

  };
  const submitHandler = async ()=>{
    setloading(true) ; 
    if(!name||!email||!password||!confirmpassword){
        toast({
            title:"Please fill all the fields" , 
            status:"warning" ,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
        setloading(false);
        return ;
    } 
    if(password!==confirmpassword){
        toast({
            title:"Both Passwords should be same" , 
            status:"warning" ,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
        return ;
    }
    try{
        const config = {
            headers:{
                "content-type":"application/json" ,

            },
        }
        const  {data} = await axios.post('/api/user' ,
         {name,email,password,pic},
        config 
        ) ;
        toast({
            title:"Registration is successfull" , 
            status:"success" ,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
        localStorage.setItem('userInfo' , JSON.stringify(data)) ;
        history.push('/chats') ;

    }
    catch(error){
        toast({
            title:"Error Occured" , 
            status:"error" ,
            description:error.response.data.message,
            duration:5000,
            isClosable:true,
            position:"bottom" 
        });
    }
  };

  return (
    <VStack spacing={'5px'}color={"black"}>
        <FormControl isRequired id ="first-name">
            <FormLabel>
                Name
            </FormLabel>
            <Input
                    placeholder='Enter Your Name'
                    onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id ="email">
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder='Enter Your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id ="password">
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
                <Input
                    type={show ?'text':'password'}
                    placeholder='Enter Your Password'
                    onChange={(e)=>setpassword(e.target.value)}
                />
                <InputRightElement width = "4.5 rem">
                    <Button h = "1.75rem" size = "sm" onClick={handleClick}>
                        {show? "Hide":"Show"}
                        
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>
        <FormControl isRequired id ="confirmpassword">
            <FormLabel>
                confirm Password
            </FormLabel>
            <InputGroup>
                <Input
                    type={showconfirm ?'text':'password'}
                    placeholder='Enter Your Password'
                    onChange={(e)=>setconfirmpassword(e.target.value)}
                />
                <InputRightElement width = "4.5 rem">
                    <Button h = "1.75rem" size = "sm" onClick={handleClickConfirm}>
                        {showconfirm? "Hide":"Show"}
                        
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl  id ="pic">
            <FormLabel>
                Upload your Pic
            </FormLabel>
            <Input 
            type = 'file' 
            p ={1.5}
            accept='image/'
            onChange={(e)=> postDetails(e.target.files[0])}/>

        </FormControl>
        <Button 
        colorScheme='blue'
        width={"100%"}
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}>
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup
