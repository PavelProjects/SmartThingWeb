#ifndef PAGE_HANDLER_H
#define PAGE_HANDLER_H

#include "Poco/Net/HTTPServerRequest.h"
#include "Poco/Net/HTTPServerResponse.h"
#include "Poco/Net/HTTPRequestHandler.h"
#include "Poco/JSON/Object.h"
#include <iostream>
#include <string>

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;

#define RESOURCES_URI "/resources"
#define RESOURCES_LENGTH 10

class ResourceRequestHandler: public HTTPRequestHandler {
    public:
        ResourceRequestHandler(const std::string &format, const std::string &resourceDir): _format(format), _resourceDir(resourceDir){};
        void handleRequest([[maybe_unused]] HTTPServerRequest &request, HTTPServerResponse &response) {
            try {
                response.add("Access-Control-Allow-Origin", "*");
                response.add("Access-Control-Allow-Methods", "GET");
                response.add("Access-Control-Allow-Headers", "Content-Type");
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_OK);
                std::string path = buildResourcePath(request.getURI());
                std::cout << "Resource path: " << path << std::endl;
                std::string mediaType = resolveMediaType(path);
                std::cout << "Media type: " << mediaType << std::endl;
                response.setContentType(mediaType + "; charset=utf-8");
                response.sendFile(path, mediaType);
            } catch (Poco::FileNotFoundException &e) {
                std::cerr << "Resources POCO not found exception: " << e.displayText() << std::endl;
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_NOT_FOUND);
                response.send();
            } catch (Poco::Exception &e) {
                std::cerr << "Resources POCO (" << e.className() << ") exception: "  << e.displayText() << std::endl;
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_INTERNAL_SERVER_ERROR);
                response.send();
            } catch (std::exception &e) {
                std::cerr << "Resources exception: " << e.what() << std::endl;
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_INTERNAL_SERVER_ERROR);
                response.send();
            }
        }
        std::string buildResourcePath(const std::string &uri) {
            if (uri == "/") {
                return _resourceDir + "/index.html";
            }
            return _resourceDir + uri.substr(RESOURCES_LENGTH, uri.length());
        }
        std::string resolveMediaType(std::string &path) {
            return "text/" + path.substr(path.find(".") + 1, path.length());
        }
    private:
        std::string _format;
        std::string _resourceDir;
};

#endif