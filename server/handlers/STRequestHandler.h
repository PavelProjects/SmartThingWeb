#ifndef ST_HANDLER_H
#define ST_HANDLER_H

#include "Poco/Net/HTTPServerRequest.h"
#include "Poco/Net/HTTPServerResponse.h"
#include "Poco/Net/HTTPRequestHandler.h"
#include "Poco/JSON/Object.h"
#include <iostream>
#include <string>

#include "../services/SmartThingService.h"

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;

class STWebRequestHandler: public HTTPRequestHandler {
    public:
        STWebRequestHandler(const std::string &format): _format(format){};
        void handleRequest(HTTPServerRequest &request, HTTPServerResponse &response) {
            response.add("Access-Control-Allow-Origin", "*");
            response.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
            response.add("Access-Control-Allow-Headers", "Content-Type, api_key, Authorization");
            if (request.getMethod() == Poco::Net::HTTPRequest::HTTP_OPTIONS) {
                response.setContentType("application/json");
                response.setKeepAlive(false);
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_OK);
                response.send();
                return;
            }
            if (request.getURI() == "/st/info" && request.getMethod() == Poco::Net::HTTPRequest::HTTP_GET) {
                response.setContentType("application/json");
                response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_OK);
                Poco::JSON::Object::Ptr info = getServiceInfo();
                std::ostream &ostr = response.send();
                Poco::JSON::Stringifier::stringify(info, ostr);
                return;
            }
            response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_NOT_FOUND);
            response.send();
        };
    private:
        std::string _format;
};

#endif