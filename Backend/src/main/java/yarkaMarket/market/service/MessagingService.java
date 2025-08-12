package yarkaMarket.market.service;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;
import yarkaMarket.market.repository.MessageRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public MessagingService(ConversationRepository conversationRepository,
                            MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    // Get all conversations for a user
    public List<Conversation> getConversationsForUser(User user) {
        return conversationRepository.findByUser(user);
    }

    // Find or create conversation between two users
    public Conversation findOrCreateConversation(User user1, User user2) {
        Optional<Conversation> conv = conversationRepository.findByUser1AndUser2(user1, user2);
        if (conv.isPresent()) return conv.get();

        Conversation newConv = new Conversation(user1, user2);
        return conversationRepository.save(newConv);
    }

    // Get messages in conversation
    public List<Message> getMessagesInConversation(Long conversationId, User user) 
        throws Exception{
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (conversation.getUser1() != user && conversation.getUser2() != user) 
            throw new Exception("User not in conversation");

        return messageRepository.findByConversation(conversation);
    }

    // Send message
    public Message sendMessage(Long conversationId, User sender, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message(conversation, sender, content);
        conversation.setLastUpdated(message.getTimestamp());    
        conversationRepository.save(conversation);
        return messageRepository.save(message);
    }
}

