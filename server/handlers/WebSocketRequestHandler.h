#ifndef WS_HANDLER_H
#define WS_HANDLER_H

#include "Poco/Net/HTTPServerRequest.h"
#include "Poco/Net/HTTPServerResponse.h"
#include "Poco/Net/HTTPRequestHandler.h"
#include "Poco/Net/WebSocket.h"
#include "Poco/JSON/Object.h"
#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include<ctime>

#include "../services/WsService.h"

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;
using Poco::Net::WebSocket;
using std::chrono::system_clock;
using std::chrono::duration;

// вынести в конфиг запуска
#define SMART_THING_GROUP "224.1.1.1"
#define FINDER_PORT 7778
#define LOGGER_PORT 7779
// получать от клиента
#define SEARCH_SECONDS 3

class WebSocketRequestHandler: public HTTPRequestHandler {
    public:
        WebSocketRequestHandler(const std::string &format): _format(format){};
        void handleRequest(HTTPServerRequest &request, HTTPServerResponse &response) {
            std::cout << "Creating new websocket" << std::endl;
            WebSocket ws(request, response);
            std::cout << "New websocket created" << std::endl;

            int port = -1;
            int timeout = -1;
            if (request.getURI() == "/ws/find") {
                port = FINDER_PORT;
                timeout = SEARCH_SECONDS;
            } else if (request.getURI() == "/ws/logs") {
                port = LOGGER_PORT;
            } else {
                std::cout << "Bad web socket path: " << request.getURI() << std::endl;
                ws.shutdown();
                return;
            }

            std::cout << "Connecting to multicast group: " << SMART_THING_GROUP << ":" << port << std::endl;
            int sock = connectToFindSocket(SMART_THING_GROUP, port);
            if (sock > 0) {
                std::cout << "Connected" << std::endl;
            } else {
                std::cout << "Socket connection failed" << std::endl;
                ws.shutdown();
                return;
            }

            try {
                std::string buff;
                auto start = system_clock::now();
                // todo add ping pong
                // data transfer in external thread
                // timeout not working without messages
                while(receiveData(sock, buff) && (timeout < 0 || duration<double>(system_clock::now() - start).count() < timeout)) {
                    ws.sendFrame(buff.c_str(), buff.length(), WebSocket::FRAME_TEXT);
                }
            } catch (Poco::Exception &e) {
                std::cerr << "WS exception: " << e.displayText() << std::endl;
            } catch (std::exception &e) {
                std::cerr << "WS exception: " << e.what() << std::endl;
            }

            try {
                closeSocket(sock);
                ws.shutdown();
                std::cout << "Websocket closed" << std::endl;
            } catch (std::exception &e) {
                std::cout << "Failed to close socket: " << e.what() << std::endl;
            }
        }
    private:
        std::string _format;
};

#endif