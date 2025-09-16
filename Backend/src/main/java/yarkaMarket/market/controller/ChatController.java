package yarkaMarket.market.controller;

/*import yarkaMarket.market.entity.ChatMessageDTO;
import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;
import yarkaMarket.market.repository.MessageRepository;
import yarkaMarket.market.repository.UserRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(UserRepository userRepository,
                          ConversationRepository conversationRepository,
                          MessageRepository messageRepository,
                          SimpMessagingTemplate simpMessagingTemplate) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // WebSocket: send message to a conversation
    @MessageMapping("/dashboard/conversations/{conversationId}/messages")
    @SendTo("/topic/messages")
    public void sendMessage(@DestinationVariable Long conversationId, ChatMessageDTO chatMessageDTO) {
        User sender = userRepository.findById(chatMessageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setConversation(conv);
        message.setContent(chatMessageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);

        // Push to all subscribers of this conversation
        simpMessagingTemplate.convertAndSend(
                "/topic/dashboard/conversations/" + conversationId + "/messages",
                new ChatMessageDTO(message.getId(), sender.getId(), message.getContent())
        );
    }
}*/
