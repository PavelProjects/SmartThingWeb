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
#include "handlers/ResourceRequestHandler.h"
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
        STWebRequestFactory(const std::string &format, const std::string &resourceDir) : _format(format), _resourceDir(resourceDir){}
        HTTPRequestHandler *createRequestHandler([[maybe_unused]] const HTTPServerRequest &request){
            const std::string uri = request.getURI();
            std::cout << "[" << request.getMethod() << "] " << uri<< std::endl;
            if (uri.rfind("/st") == 0) {
                return new STWebRequestHandler(_format);
            } else if (uri.rfind("/ws") == 0) {
                return new WebSocketRequestHandler(_format);
            } else if (uri == "/" || uri.rfind(RESOURCES_URI) == 0) {
                return new ResourceRequestHandler(_format, _resourceDir);
            }
            return 0;
        }
    private:
        std::string _format;
        std::string _resourceDir;
};

class STWebServer: public Poco::Util::ServerApplication {
    public:
        STWebServer() : _helpRequested(false){}
        ~STWebServer() {}
        void setPort([[maybe_unused]] const std::string &name, const std::string &value) {
            _port = atoi(value.c_str());
        }
        void setResourceDir([[maybe_unused]] const std::string &name, const std::string &value) {
            if (value.length() <= 0) {
                return;
            }
            if (value.at(value.size() - 1) == '/') {
                _resourceDir = value.substr(0, value.size() - 1);
            } else {
                _resourceDir = value;
            }
        }
    protected:
        void initialize(Application &self) {
            loadConfiguration();
            ServerApplication::initialize(self);
        }
        void uninitialize() {
            ServerApplication::uninitialize();
        }
        void defineOptions(Poco::Util::OptionSet& options) {
            Application::defineOptions(options);
            options.addOption(
				Poco::Util::Option("port", "p", "set service port")
                    .required(false)
                    .repeatable(false)
                    .argument("port=value")
                    .callback(Poco::Util::OptionCallback<STWebServer>(this, &STWebServer::setPort)
                )
            );
            options.addOption(
				Poco::Util::Option("resource_dir", "r", "path to resource directory")
                    .required(true)
                    .repeatable(false)
                    .argument("resource_dir=value")
                    .callback(Poco::Util::OptionCallback<STWebServer>(this, &STWebServer::setResourceDir)
                )
            );
        }

        int main([[maybe_unused]] const std::vector<std::string> &args) {
            if (std::getenv("PORT") != nullptr) {
                _port = atoi(std::getenv("PORT"));
            }

            if (!_helpRequested) {
                ServerSocket svs(Poco::Net::SocketAddress("0.0.0.0", _port));
                HTTPServer srv(new STWebRequestFactory(DateTimeFormat::SORTABLE_FORMAT, _resourceDir), svs, new HTTPServerParams);
                srv.start();
                std::cout << "Server started on port: " << _port << std::endl;
                std::cout << "Resources directory: " << _resourceDir << std::endl;
                waitForTerminationRequest();
                srv.stop();
                std::cout << "Server stoped" << std::endl;
            }
            return Application::EXIT_OK;
        }
    private:
        bool _helpRequested;
        int _port = 8080;
        std::string _resourceDir;
};

#endif