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

class PageRequestHandler: public HTTPRequestHandler {
    public:
        PageRequestHandler(const std::string &format): _format(format){};
        void handleRequest([[maybe_unused]] HTTPServerRequest &request, HTTPServerResponse &response) {
            response.add("Access-Control-Allow-Origin", "*");
            response.add("Access-Control-Allow-Methods", "GET");
            response.add("Access-Control-Allow-Headers", "Content-Type");
            response.setContentType("text/html; charset=utf-8");
            response.setStatusAndReason(Poco::Net::HTTPResponse::HTTP_OK);
            response.sendFile("./server/pages/index.html", "text/html");
        }
    private:
        std::string _format;
};

#endif