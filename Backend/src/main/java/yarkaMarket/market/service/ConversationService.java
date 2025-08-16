package yarkaMarket.market.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;

    public Conversation startConversationWithUser(User currentUser, User otherUser) {
        // Check if conversation already exists between these two
        return conversationRepository.findBetweenUsers(currentUser, otherUser)
                .orElseGet(() -> {
                    // Create new conversation if none exists
                    Conversation conversation = new Conversation();
                    conversation.setUser1(currentUser);
                    conversation.setUser2(otherUser);
                    return conversationRepository.save(conversation);
                });
    }
}
