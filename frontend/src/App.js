import "./App.css";
import { Route } from "react-router-dom";
import homepage from "./Pages/homepage";
import Chatpage from "./Pages/chatpage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;