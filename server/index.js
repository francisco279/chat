import express                   from "express";
import morgan                    from "morgan";
import { Server as SocketServer} from "socket.io";
import http                      from "http";
import cors                      from "cors";
import { PORT }                  from "./config.js";
import { dirname, join }                      from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
//set a http server for the web sockets
const server = http.createServer(app);
//config the server to allows connections from localhost 3000 (client app)
const io     = new SocketServer(server, {
    cors: 
    {
     //   origin: "http://localhost:3000", cors is only for development (allows in that case)
     //
    }
});

//middlewares
app.use(cors()); //allows conections of other servers 
app.use(morgan("dev"));

//wait for connections from client (initial connections)
io.on("connection", (socket) => {
    console.log(socket.id);
    
    //socket listen the message from client and send the message to all clients
    socket.on("message", (message) => {
        console.log(message);
        socket.broadcast.emit("message", {
            body: message,
            from: socket.id,
        });
    });
});
//static files(front end (client))
app.use(express.static(join(__dirname, "../client/build")))

server.listen(PORT);
console.log("Server on port", PORT);