```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: HTTP POST /new_note_spa
    Server-->>Browser: 201 Created

Note over Browser: Javascript updates list without reloading page

```