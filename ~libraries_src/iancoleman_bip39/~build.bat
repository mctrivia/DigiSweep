@echo off
ECHO Building bip39.min.js

::verify compiler present
IF NOT EXIST %~dp0..\~compiler.jar GOTO missingcompiler

::Check needed files exist then minify to   ..\bip39.min.js
IF NOT EXIST %~dp0..\~wrapperStart.js GOTO missingfile
IF NOT EXIST %~dp0..\~wrapperEnd.js GOTO missingfile
IF NOT EXIST %~dp0myextensions.js GOTO missingfile
IF NOT EXIST %~dp0levenshtein.js GOTO missingfile
IF NOT EXIST %~dp0sjcl-bip39.js GOTO missingfile
IF NOT EXIST %~dp0wordlist.js GOTO missingfile
IF NOT EXIST %~dp0jsbip39.js GOTO missingfile
IF NOT EXIST %~dp0biginteger.js GOTO missingfile
IF NOT EXIST %~dp0mycode.js GOTO missingfile
IF NOT EXIST %~dp0bitcoinjs-3.3.2-mkc.js GOTO missingfile
IF EXIST %~dp0~~temp.js DEL %~dp0~~temp.js
java -jar %~dp0..\~compiler.jar --js %~dp0myextensions.js --js %~dp0levenshtein.js --js %~dp0sjcl-bip39.js --js %~dp0wordlist.js --js %~dp0jsbip39.js --js %~dp0biginteger.js --js %~dp0mycode.js --js_output_file %~dp0~~temp.js --compilation_level SIMPLE 1>NUL
IF NOT EXIST %~dp0~~temp.js GOTO failed
IF EXIST %~dp0..\bip39.min.js DEL %~dp0..\bip39.min.js
copy /b %~dp0..\~wrapperStart.js + %~dp0bitcoinjs-3.3.2-mkc.js + %~dp0..\~wrapperEnd.js + %~dp0..\~wrapperStart.js + %~dp0~~temp.js + %~dp0..\~wrapperEnd.js %~dp0..\bip39.min.js 1>NUL
del %~dp0~~temp.js
IF NOT EXIST %~dp0..\bip39.min.js GOTO failed

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
:failed
ECHO Failed: Couldn't create bip39.min.js
pause

:end