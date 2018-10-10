@echo off
ECHO Building gibberish-aes.min.js

::verify compiler present
IF NOT EXIST %~dp0..\~compiler.jar GOTO missingcompiler

::Check needed files exist then combine to 1 file
IF NOT EXIST %~dp0..\~wrapperStart.js GOTO missingfile
IF NOT EXIST %~dp0..\~wrapperEnd.js GOTO missingfile
IF NOT EXIST %~dp0gibberish-aes.js GOTO missingfile
IF EXIST %~dp0~~temp.js DEL %~dp0~~temp.js
JAVA -jar %~dp0..\~compiler.jar --js %~dp0gibberish-aes.js --js_output_file %~dp0~~temp.js --compilation_level SIMPLE 1>NUL
IF NOT EXIST %~dp0~~temp.js GOTO failed
IF EXIST %~dp0..\gibberish-aes.min.js DEL %~dp0..\gibberish-aes.min.js
COPY /b %~dp0..\~wrapperStart.js + %~dp0~~temp.js + %~dp0..\~wrapperEnd.js %~dp0..\gibberish-aes.min.js /V 1>NUL
DEL %~dp0~~temp.js
IF NOT EXIST %~dp0..\gibberish-aes.min.js GOTO failed

::Pause if not batch running
IF "%1"=="Y" GOTO end
ECHO Success
PAUSE
GOTO end

::Compiler Missing
:missingcompiler
ECHO Failed: Google Closure Compiler missing.
PAUSE
GOTO end

::Show generic error message
:missingfile
ECHO Failed: Needed file was missing
PAUSE
GOTO end

::Expected output file missing
:failed
ECHO Failed: Couldn't create gibberish-aes.min.js
PAUSE

:end