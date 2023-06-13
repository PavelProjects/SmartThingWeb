cmake_minimum_required(VERSION 3.2)

project(smart_thing_server C CXX)

SET (WEB_SERVICE "web_service")

set (STD_CXX "c++17")
set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -W -Wall -std=${STD_CXX} ${REDISCPP_FLAGS}")
set (CMAKE_CXX_FLAGS_RELEASE "-O3 -g0 -std=${STD_CXX} -Wall -DNDEBUG ${REDISCPP_FLAGS}")

find_package(OpenSSL)
find_package(Threads)
find_package(ZLIB)
find_package(Poco REQUIRED COMPONENTS Foundation Util Net XML JSON Crypto NetSSL)


if(NOT ${Poco_FOUND})
    message(FATAL_ERROR "Poco C++ Libraries not found.")
endif()

include_directories(${Poco_INCLUDE_DIRS})
link_directories("/usr/local/lib")

SET(CMAKE_CXX_STANDARD 17)
SET(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(${WEB_SERVICE} main.cpp)
target_include_directories(${WEB_SERVICE} PRIVATE "${CMAKE_BINARY_DIR}")
target_compile_options(${WEB_SERVICE} PRIVATE -Wall -Wextra -pedantic -Werror )
set_target_properties(${WEB_SERVICE} PROPERTIES LINKER_LANGUAGE CXX)
set_target_properties(${WEB_SERVICE} PROPERTIES CXX_STANDARD 17 CXX_STANDARD_REQUIRED ON)

target_link_libraries(${WEB_SERVICE} PRIVATE 
                             ${CMAKE_THREAD_LIBS_INIT} 
                             ${Poco_LIBRARIES}
                             "PocoData"
                             "PocoJWT"
                             ZLIB::ZLIB)