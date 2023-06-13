#ifndef WS_SERVICE_H
#define WS_SERVICE_H

#include <sys/socket.h>
#include <strings.h>
#include <string>
#include <arpa/inet.h>
#include <stdexcept>

int connectToFindSocket(std::string ip_addr, int port) {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    const int optval = 1;
    setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval));
    struct sockaddr_in addr;
    bzero(&addr, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = inet_addr("224.1.1.1");
    bind(sock, (sockaddr *)&addr, sizeof(addr));

    struct ip_mreq mreq;
    inet_aton(ip_addr.c_str(), &(mreq.imr_multiaddr));
    mreq.imr_interface.s_addr = htonl(INADDR_ANY);
    setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));
    return sock;
}

bool receiveData(int sock, std::string &data) {
    char buff[4096];
    int read = recv(sock, buff, sizeof(buff), 0);
    if (read < 0) {
        std::cerr << "Failed to receive data from multicast socket" << std::endl;
        return false;
    }
    data = std::string(buff);
    data.resize(read); // выглядит не оч кончено да
    return true;
}

void closeSocket(int sock) {
    close(sock);
}

#endif