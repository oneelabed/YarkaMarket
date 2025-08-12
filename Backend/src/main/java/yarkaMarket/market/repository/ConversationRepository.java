package yarkaMarket.market.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.User;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    // Find all conversations where user is participant
    @Query("SELECT c FROM Conversation c WHERE c.user1 = ?1OR c.user2 = ?1")
    List<Conversation> findByUser(User user);

    // Find conversation between two users regardless of order
    @Query("SELECT c FROM Conversation c WHERE c.user1 = ?1AND c.user2 = ?2OR c.user1 = ?2AND c.user2 = ?1")
    Optional<Conversation> findByUser1AndUser2(User user1, User user2);
}

