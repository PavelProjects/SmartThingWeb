#ifndef ST_SERVICE_H
#define ST_SERVICE_H

#include "Poco/JSON/Object.h"
#include <Poco/JSON/Parser.h>

Poco::JSON::Object::Ptr getServiceInfo() {
    Poco::JSON::Object::Ptr root = new Poco::JSON::Object();
    root->set("version", "1.0");
    root->set("description", "Smart thing web service");
    return root;
}

#endif