@echo off
ECHO Building digibyte.min.js

::Check needed files exist then combine to 1 file
IF NOT EXIST %~dp1~wrapperStart.js GOTO missingfile
IF NOT EXIST %~dp1~wrapperEnd.js GOTO missingfile
IF NOT EXIST %~dp0digibyte.min.js GOTO missingfile
IF EXIST %~dp1digibyte.min.js DEL %~dp1digibyte.min.js
copy /b %~dp1~wrapperStart.js + %~dp0digibyte.min.js + %~dp1~wrapperEnd.js %~dp1digibyte.min.js /V 1>NUL
IF NOT EXIST %~dp1digibyte.min.js GOTO failed

::Pause if not batch running
IF "%1"=="Y" GOTO end
ECHO Success
PAUSE
GOTO end

::Show generic error message
:missingfile
ECHO Failed: Needed file was missing
PAUSE
GOTO end

::Expected output file missing
:failed
ECHO Failed: Couldn't create digibyte.min.js
PAUSE

:end