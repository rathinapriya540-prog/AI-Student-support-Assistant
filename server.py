import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output encoding for standard output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    print(f"==================================================")
    print(f"AI Student Support Assistant Web Server Running")
    print(f"Access URL: http://localhost:{PORT}")
    print(f"==================================================")
    
    webbrowser.open(f"http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped gracefully.")
