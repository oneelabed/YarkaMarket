package yarkaMarket.market.controller;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.service.ConversationService;
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
    private final ConversationService conversationService;

    public MessagingController(MessagingService messagingService, 
        UserRepository userRepository, 
        ConversationService conversationService) {
        this.messagingService = messagingService;
        this.userRepository = userRepository;
        this.conversationService = conversationService;
    }
    @GetMapping("/conversations")
    public List<Conversation> getConversations(Principal userDetails) {
        User user = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return messagingService.getConversationsForUser(user);
    }
    @GetMapping("/conversations/{id}/messages")
    public List<Message> getMessages(@PathVariable Long id, Principal userDetails) 
        throws Exception{
        User user = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
                
        return messagingService.getMessagesInConversation(id, user);
    }

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

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long id,
                                         @RequestBody MessageRequest request,
                                         Principal userDetails) {
        User sender = userRepository.findUserByEmail(userDetails.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messagingService.sendMessage(id, sender, request.getContent());
        return ResponseEntity.ok(message);
    }

    @GetMapping("/unreadCount/{userId}")
    public long getUnreadCount(@PathVariable Long userId) {
        return messagingService.getUnreadCount(userId);
    }

    @PostMapping("/markAsRead/{conversationId}/{userId}")
    public void markAsRead(@PathVariable Long conversationId, @PathVariable Long userId) {
        messagingService.markConversationAsRead(conversationId, userId);
    }

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

    @PostMapping("conversations/start/{otherUserId}")
    public ResponseEntity<Conversation> startConversation(
            Principal current,
            @PathVariable Long otherUserId) {

        User currentUser = userRepository.findUserByEmail(current.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationService.startConversationWithUser(currentUser, otherUser);

        return ResponseEntity.ok(conversation);
    }
}

