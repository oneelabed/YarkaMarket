package yarkaMarket.market.service;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;
import yarkaMarket.market.repository.MessageRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    // Get all conversations for a user
    public List<Conversation> getConversationsForUser(User user) {
        return conversationRepository.findByUser(user);
    }

    public Conversation findOrCreateConversation(User user1, User user2) {
        Optional<Conversation> conv = conversationRepository.findByUser1AndUser2(user1, user2);
        if (conv.isPresent()) return conv.get();

        Conversation newConv = new Conversation(user1, user2);
        return conversationRepository.save(newConv);
    }

    public List<Message> getMessagesInConversation(Long conversationId, User user) 
        throws Exception{
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (conversation.getUser1() != user && conversation.getUser2() != user) 
            throw new Exception("User not in conversation");

        return messageRepository.findByConversation(conversation);
    }

    public Message sendMessage(Long conversationId, User sender, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message(conversation, sender, content);
        conversation.setLastUpdated(message.getTimestamp());    
        conversationRepository.save(conversation);
        Message savedMessage = messageRepository.save(message);
        
        sendWebSocketNotification(savedMessage, conversation, sender);

        User recipient = conversation.getUser1().getId().equals(sender.getId())
                ? conversation.getUser2() 
                : conversation.getUser1();

        String preview = content.length() > 100 ? content.substring(0, 100) + "..." : content;
        emailService.sendNewMessageNotification(recipient, sender, preview, conversationId);
        
        return savedMessage;
    }
    
    private void sendWebSocketNotification(Message message, Conversation conversation, User sender) {
        try {
            User recipient = conversation.getUser1().getId().equals(sender.getId()) 
                    ? conversation.getUser2() 
                    : conversation.getUser1();

            WebSocketMessageNotification notification = new WebSocketMessageNotification(
                    message.getId(),
                    message.getConversation().getId(),
                    message.getSender().getId(),
                    message.getSender().getUsername(),
                    message.getContent(),
                    message.getTimestamp()
            );

            messagingTemplate.convertAndSendToUser(
                    recipient.getEmail(),
                    "/queue/messages",
                    notification
            );
            
            System.out.println("WebSocket notification sent to: " + recipient.getEmail());
            
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static class WebSocketMessageNotification {
        private Long id;
        private Long conversationId;
        private Long senderId;
        private String senderUsername;
        private String content;
        private java.time.ZonedDateTime timestamp;

        public WebSocketMessageNotification(Long id, Long conversationId, Long senderId, 
                                           String senderUsername, String content, 
                                           java.time.ZonedDateTime timestamp) {
            this.id = id;
            this.conversationId = conversationId;
            this.senderId = senderId;
            this.senderUsername = senderUsername;
            this.content = content;
            this.timestamp = timestamp;
        }

        public Long getId() { return id; }
        public Long getConversationId() { return conversationId; }
        public Long getSenderId() { return senderId; }
        public String getSenderUsername() { return senderUsername; }
        public String getContent() { return content; }
        public java.time.ZonedDateTime getTimestamp() { return timestamp; }
    }
}

