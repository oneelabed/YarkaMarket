package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to handle the Render health check path (/healthz).
 * This endpoint must NOT connect to the database to ensure Neon's 
 * Scale-to-Zero feature works correctly.
 */
@RestController 
public class HealthCheckController {

    // Ensure this path matches the one you have configured in Render (e.g., /healthz)
    @GetMapping("/healthz") 
    public ResponseEntity<String> healthCheck() {
        
        // --- CRITICAL: SHALLOW CHECK IMPLEMENTATION ---
        // We only check that the Spring Boot server process is alive.
        // No database connections, no JpaRepository calls, no SQL queries.
        
        // Return a successful HTTP 200 OK status.
        return ResponseEntity.ok("Marketplace Server is Healthy and Responding."); 
    }
}