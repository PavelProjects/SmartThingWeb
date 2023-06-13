FROM ubuntu
ENV TZ=Europe/Moscow
RUN apt-get clean && apt-get update -y 
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install sudo git zlib1g-dev openssl libssl-dev g++ make cmake libssl-dev && apt-get clean
RUN git clone -b master https://github.com/pocoproject/poco.git && cd poco && mkdir cmake-build && cd cmake-build && cmake .. && make -j2 && sudo make install
RUN sudo ldconfig
COPY ./server ./
RUN mkdir build && cd ./build && cmake .. && make
entrypoint ["./build/web_service"]