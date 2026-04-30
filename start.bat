@echo off
echo ==========================================
echo Inicializando AirMind...
echo ==========================================

echo.
echo 1. Instalando dependencias (pnpm install)...
call pnpm install

echo.
echo 2. Iniciando servidor de desarrollo...
call pnpm run dev

pause
