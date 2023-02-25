pushd %~dp0

::MatchClient
SET MatchClientDir=../../CppServer/GameServer/
DEL /Q /F "%MatchClientDir%Proto"
.\Plugins\protoc.exe --grpc_out=.\ --cpp_out=.\ .\match.proto --plugin=protoc-gen-grpc=.\Plugins\grpc_cpp_plugin.exe

::GameClientTest
SET GameClientTestDir=../../Client/2DGameClient/
.\Plugins\protoc.exe --grpc_out=.\ --cpp_out=.\ .\match.proto --plugin=protoc-gen-grpc=.\Plugins\grpc_cpp_plugin.exe


::MatchServer
SET MatchServerDir=../../CppServer/MatchServer/
DEL /Q /F "%MatchServerDir%Proto"
.\Plugins\protoc.exe --grpc_out=. --csharp_out=. --csharp_opt=file_extension=.g.cs .\match.proto --plugin=protoc-gen-grpc=.\Plugins\grpc_csharp_plugin.exe

::CppServer
SET CppServerDir=../../CppServer/GameServer/
DEL /Q /F "%CppServerDir%Proto"
.\Plugins\protoc.exe --cpp_out=.\ .\protocol.proto --proto_path=.\
.\Plugins\protoc.exe --cpp_out=.\ .\struct.proto --proto_path=.\
.\Plugins\protoc.exe --cpp_out=.\ .\enum.proto --proto_path=.\

::GameClient
SET GameClientDir=../../Client/2DGameClient/
DEL /Q /F "%GameClientDir%Proto"

IF ERRORLEVEL 1 PAUSE

::MatchClient
::GameClientTest
XCOPY /Y .\match.pb.h "%GameClientTestDir%Proto/*"
XCOPY /Y .\match.pb.cc "%GameClientTestDir%Proto/*"
XCOPY /Y .\match.grpc.pb.h "%GameClientTestDir%Proto/*"
XCOPY /Y .\match.grpc.pb.cc "%GameClientTestDir%Proto/*"
::

XCOPY /Y .\match.pb.h "%MatchClientDir%Proto/*"
XCOPY /Y .\match.pb.cc "%MatchClientDir%Proto/*"
XCOPY /Y .\match.grpc.pb.h "%MatchClientDir%Proto/*"
XCOPY /Y .\match.grpc.pb.cc "%MatchClientDir%Proto/*"
DEL /Q /F ".\match*.pb.cc"
DEL /Q /F ".\match*.pb.h"

::MatchServer
XCOPY /Y .\Match.g.cs "%MatchServerDir%Proto/*"
XCOPY /Y .\MatchGrpc.cs "%MatchServerDir%Proto/*"
DEL /Q /F ".\match*.g.cs"
DEL /Q /F ".\match*.cs"

::CppServer GameClient
XCOPY /Y .\enum.pb.h "%CppServerDir%Proto/*"
XCOPY /Y .\enum.pb.cc "%CppServerDir%Proto/*"
XCOPY /Y .\struct.pb.h "%CppServerDir%Proto/*"
XCOPY /Y .\struct.pb.cc "%CppServerDir%Proto/*"
XCOPY /Y .\protocol.pb.h "%CppServerDir%Proto/*"
XCOPY /Y .\protocol.pb.cc "%CppServerDir%Proto/*"


XCOPY /Y .\enum.pb.h "%GameClientDir%Proto/*"
XCOPY /Y .\enum.pb.cc "%GameClientDir%Proto/*"
XCOPY /Y .\struct.pb.h "%GameClientDir%Proto/*"
XCOPY /Y .\struct.pb.cc "%GameClientDir%Proto/*"
XCOPY /Y .\protocol.pb.h "%GameClientDir%Proto/*"
XCOPY /Y .\protocol.pb.cc "%GameClientDir%Proto/*"

DEL /Q /F ".\enum*.pb.cc"
DEL /Q /F ".\enum*.pb.h"
DEL /Q /F ".\struct.pb.cc 
DEL /Q /F ".\struct*.pb.h"
DEL /Q /F ".\protocol*.pb.cc"
DEL /Q /F ".\protocol*.pb.h"


PAUSE