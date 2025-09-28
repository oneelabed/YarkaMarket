package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;
import yarkaMarket.market.repository.ListingRepository;
import yarkaMarket.market.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ListingRepository listingRepository;

    public AdminController(UserRepository userRepository,
                           ConversationRepository conversationRepository,
                           ListingRepository listingRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.listingRepository = listingRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalConversations", conversationRepository.count());
        stats.put("totalListings", listingRepository.countActive());
        return stats;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/conversations")
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findById(id).get();
        user.setApproved(true);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
