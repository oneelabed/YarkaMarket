package yarkaMarket.market.controller;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.service.MessagingService;
import yarkaMarket.market.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class MessagingController {

    private final MessagingService messagingService;
    private final UserRepository userRepository;

    public MessagingController(MessagingService messagingService, UserRepository userRepository) {
        this.messagingService = messagingService;
        this.userRepository = userRepository;
    }

    // Get all conversations for logged in user
    @GetMapping("/conversations")
    public List<Conversation> getConversations(Principal userDetails) {
        User user = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return messagingService.getConversationsForUser(user);
    }

    // Get messages in a conversation
    @GetMapping("/conversations/{id}/messages")
    public List<Message> getMessages(@PathVariable Long id, Principal userDetails) 
        throws Exception{
        User user = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return messagingService.getMessagesInConversation(id, user);
    }

    // Start a conversation with a user (or find existing)
    @PostMapping("/conversations")
    public ResponseEntity<?> startConversation(@RequestBody ConversationRequest request,
                                               Principal userDetails) {
        User user1 = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = messagingService.findOrCreateConversation(user1, user2);
        return ResponseEntity.ok(conversation);
    }

    // Send message
    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long id,
                                         @RequestBody MessageRequest request,
                                         Principal userDetails) {
        User sender = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messagingService.sendMessage(id, sender, request.getContent());
        return ResponseEntity.ok(message);
    }

    // DTO classes for requests
    public static class MessageRequest {
        private String content;
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class ConversationRequest {
        private Long userId;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}

