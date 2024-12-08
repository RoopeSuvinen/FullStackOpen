```mermaid
sequenceDiagram
    participant Browser
    participant Server


    Browser->>Server: HTTP GET /spa
    Server-->>Browser: HTML-file
    Browser->>Server: HTTP GET /main.css
    Server-->>Browser: CSS-file
    Browser->>Server: HTTP GET /spa.js
    Server-->>Browser: JavaScript-file
    Browser->>Server: HTTP GET /data.json
    Server-->>Browser: JSON-data

```