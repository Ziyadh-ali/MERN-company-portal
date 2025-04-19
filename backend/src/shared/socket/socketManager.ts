import {Server as IOServer , Socket} from "socket.io";

export class SocketManager {
    private io : IOServer;

    constructor(io : IOServer){
        this.io = io;
    }

    public handleConnections() : void {
        this.io.on("connection" , (socket : Socket)=> {
            console.log("New client connected",socket.id);

            socket.on("chat message" , (msg : string) => {
                console.log("Message received : " , msg);
                this.io.emit("chat message" ,msg);
            });
            
            socket.on("disconnect", () => {
                console.log("Client disconnected : ",socket.id);
            });
        });
    }
}