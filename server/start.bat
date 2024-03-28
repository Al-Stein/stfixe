REM Start the WebSocket server
start npm start

REM Start the email checker
python mail.py

REM Redirect to http://localhost:3000/
start http://localhost:3000/

REM Wait for the WebSocket server to start
ping 127.0.0.1 -n 4 > nul




