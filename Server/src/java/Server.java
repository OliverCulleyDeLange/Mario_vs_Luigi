package java;

/**
 * Created by OCulley1 on 28/03/2014.
 */
import java.io.*;
import java.net.*;

public class Server {

    public void go() {
        try {
            ServerSocket serverSock = new ServerSocket(4444);
        while(true) {
            System.out.println("Waiting for connection request");
            Socket sock = serverSock.accept(); // Hangs waiting for requests

            PrintWriter writer = new PrintWriter(sock.getOutputStream());
            writer.println("TEST STRING FROM SERVER");
            writer.close();
            System.out.println("Test string sent");
        }
        } catch(IOException ex) {
            ex.printStackTrace();
        }
    } // close go

    public static void main(String[] args) {
        Server server = new Server();
        server.go();
    }
}
