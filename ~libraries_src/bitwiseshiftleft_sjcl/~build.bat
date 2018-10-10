@echo off
ECHO Building sjcl.min.js

::Check needed files exist then combine to 1 file
IF NOT EXIST %~dp0..\~wrapperStart.js GOTO missingfile
IF NOT EXIST %~dp0..\~wrapperEnd.js GOTO missingfile
IF NOT EXIST %~dp0sjcl.min.js GOTO missingfile
IF EXIST %~dp0..\sjcl.min.js DEL %~dp0..\sjcl.min.js
COPY /b %~dp0..\~wrapperStart.js + %~dp0sjcl.min.js + %~dp0..\~wrapperEnd.js %~dp0..\sjcl.min.js /V 1>NUL
IF NOT EXIST %~dp0..\sjcl.min.js GOTO failed

::Pause if not batch running
IF "%1"=="Y" GOTO end
ECHO Success
PAUSE
GOTO end

::Show generic error message
:missingfile
ECHO Failed: Needed file was missing.
PAUSE
GOTO end

::Expected output file missing
:failed
ECHO Failed: Couldn't create sjcl.min.js
PAUSE

:end