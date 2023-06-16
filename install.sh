apt-get -y install tzdata git sudo build-essential autoconf libtool libssl-dev zlib1g-dev pkg-config cmake gcc git g++ libboost-all-dev libssl-dev && apt-get clean
git clone -b master https://github.com/pocoproject/poco.git && cd poco && mkdir cmake-build && cd cmake-build && cmake .. && make -j2 && sudo make install
sudo ldconfig