#ifndef WEB_SERVICE_H
#define WEB_SERVICE_H

#include "Poco/Net/HTTPRequestHandler.h"
#include "Poco/Net/HTTPRequestHandlerFactory.h"
#include "Poco/Net/HTTPServerRequest.h"
#include "Poco/Net/HTTPServerResponse.h"
#include "Poco/Util/ServerApplication.h"
#include "Poco/Net/ServerSocket.h"
#include "Poco/Net/HTTPServer.h"
#include "Poco/Net/HTTPServerParams.h"
#include "Poco/DateTimeFormat.h"
#include "Poco/JSON/Object.h"
#include <iostream>
#include <string>

#include "handlers/STRequestHandler.h"
#include "handlers/PageRequestHandler.h"
#include "handlers/WebSocketRequestHandler.h"

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPRequestHandlerFactory;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;
using Poco::Util::ServerApplication;
using Poco::Net::ServerSocket;
using Poco::Net::HTTPServer;
using Poco::Net::HTTPServerParams;
using Poco::DateTimeFormat;


class STWebRequestFactory: public HTTPRequestHandlerFactory {
    public:
        STWebRequestFactory(const std::string &format) : _format(format){}
        HTTPRequestHandler *createRequestHandler([[maybe_unused]] const HTTPServerRequest &request){
            std::cout << "[" << request.getMethod() << "] " << request.getURI()<< std::endl;
            if (request.getURI().rfind("/st") == 0) {
                return new STWebRequestHandler(_format);
            } else if (request.getURI().rfind("/ws") == 0) {
                return new WebSocketRequestHandler(_format);
            } else if (request.getURI() == "/" || request.getURI() == "/index.html") {
                return new PageRequestHandler(_format);
            }
            return 0;
        }
    private:
        std::string _format;
};

class STWebServer: public Poco::Util::ServerApplication {
    public:
        STWebServer() : _helpRequested(false){}
        ~STWebServer() {}
    protected:
        void initialize(Application &self) {
            loadConfiguration();
            ServerApplication::initialize(self);
        }
        void uninitialize() {
            ServerApplication::uninitialize();
        }
        int main([[maybe_unused]] const std::vector<std::string> &args) {
            const char * portValue = "8080";
            if (std::getenv("PORT") != nullptr) {
                portValue = std::getenv("PORT");
            }

            if (!_helpRequested) {
                ServerSocket svs(Poco::Net::SocketAddress("0.0.0.0", atoi(portValue)));
                HTTPServer srv(new STWebRequestFactory(DateTimeFormat::SORTABLE_FORMAT), svs, new HTTPServerParams);
                srv.start();
                std::cout << "server started on port " << portValue << std::endl;
                waitForTerminationRequest();
                srv.stop();
                std::cout << "server stoped" << std::endl;
            }
            return Application::EXIT_OK;
        }
    private:
        bool _helpRequested;
};

#endif