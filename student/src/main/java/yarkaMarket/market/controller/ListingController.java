package yarkaMarket.market.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;

import javax.print.DocFlavor.STRING;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.entity.Listing;
import yarkaMarket.market.entity.Listing.Category;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ListingRepository;
import yarkaMarket.market.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class ListingController {
    @Value("${upload.path:uploads}")
    private String uploadDir;
    @Autowired
    private final ListingRepository repository;
    private final UserRepository userRepository;

    @GetMapping("/market")
    public List<Listing> getAllListings() {
        return repository.findAll();
    }

    @GetMapping("/my-listings")
    public List<Listing> getMyListings(Principal principal) {
        // Get the username from the token
        String email = principal.getName();

        // Find the user in DB
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return repository.findAll().stream().filter(listing -> listing.getUserCreatedBy() != null && listing.getUserCreatedBy().getId().equals(user.getId())).toList();
    }
    

    @PostMapping("/create-listing")
    public ResponseEntity<String> createListing(@RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("category") String categoryStr,
        @RequestParam("price") double price,
        @RequestParam("image") MultipartFile image,
        Principal principal) throws IOException {

        // Get the username from the token
        String email = principal.getName();
        
        // Find the user in DB
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category;
        try {
            category = Category.valueOf(categoryStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid category");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the file locally
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        Listing listing = new Listing(title, description, price, category, filename, user);

        repository.save(listing);
        return ResponseEntity.ok("Listing created successfully");
    }
}