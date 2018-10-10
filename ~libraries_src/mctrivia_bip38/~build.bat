@echo off
ECHO Building bip38d.min.js and bip38d_worker.min.js

::verify compiler present
IF NOT EXIST %~dp0..\~compiler.jar GOTO missingcompiler

::Check needed files exist then minify to    %~dp0..\bip38d.min.js
IF NOT EXIST %~dp0..\~wrapperStart.js GOTO missingfile
IF NOT EXIST %~dp0..\~wrapperEnd.js GOTO missingfile
IF NOT EXIST %~dp0bip38d.js GOTO missingfile
IF NOT EXIST %~dp0bip38d_worker.min.js GOTO missingfile
IF EXIST %~dp0~~temp.js DEL %~dp0~~temp.js
java -jar %~dp0..\~compiler.jar --js %~dp0bip38d.js --js_output_file %~dp0~~temp.js --compilation_level ADVANCED 1>NUL
IF NOT EXIST %~dp0~~temp.js GOTO failed
IF EXIST %~dp0..\bip38d.min.js DEL %~dp0..\bip38d.min.js
copy /b %~dp0..\~wrapperStart.js + %~dp0~~temp.js + %~dp0..\~wrapperEnd.js %~dp0..\bip38d.min.js 1>NUL
del %~dp0~~temp.js
IF NOT EXIST %~dp0..\bip38d.min.js GOTO failed1

::Check worker exists and copy
IF EXIST %~dp0..\bip38d_worker.min.js DEL %~dp0..\bip38d_worker.min.js
copy %~dp0bip38d_worker.min.js %~dp0..\bip38d_worker.min.js 1>NUL
IF NOT EXIST %~dp0..\bip38d_worker.min.js GOTO failed2

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
ECHO Failed: Needed file was missing.
PAUSE
GOTO end

::Expected output file missing
:failed1
ECHO Failed: Couldn't create bip38d.min.js
pause
GOTO end

::Expected output file missing
:failed2
ECHO Failed: Couldn't create bip38d_worker.min.js
pause

:end