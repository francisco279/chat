import './App.css';
import io from "socket.io-client"; //web socket client
import { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, Center, Container, FormControl, Heading, Input, Text } from '@chakra-ui/react';

const socket = io(); //addres from backend server
//const socket = io("http://localhost:4000"); //only for development
function App() {

  const [message,  setMessage]  = useState(""); //to send the message
  const [messages, setMessages] = useState([{}]); //save all the messages
  
  //function that sends the message from the form 
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body:message,
      from: "Me"
    }
    setMessages([...messages, newMessage])
    setMessage("");
  }
  //listen to server message
  useEffect( () => {

    const receiveMessage = message => {
      setMessages([...messages, message])
    }

    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage)
    }
  }, [messages])

  return (
    <div className="App">
      <Container
       
      >
      <Center>
      <form onSubmit={handleSubmit}>
        <FormControl mt={"32px"}>
          <Input
            placeholder='Type a message'
            onChange={e => setMessage(e.target.value)}
          >
          </Input>
          <FormControl>
            <Button
              mt={4}
              type="submit"
            >
              Send Message
            </Button>
          </FormControl>
          
        </FormControl>
      </form>
      </Center>

      {
       
       messages.map((message, index) => (
        <Center>
         <div key={index}>
             <p>{message.from}: {message.body}</p>
         </div>
        </Center>
       ))
     
     }
      </Container>
    </div>
  );
}

export default App;
