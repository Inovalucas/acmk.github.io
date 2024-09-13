@echo off
title BOT POLICE
echo Iniciando BOT [...]
:main
    node server.js
    if %errorlevel% neq 0 (
        echo BOT falhou com erro %errorlevel%. Reiniciando em 5 segundos...
        timeout /t 5
    )
    goto main
