package yarkaMarket.market.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.User;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE c.user1 = ?1OR c.user2 = ?1")
    List<Conversation> findByUser(User user);

    @Query("SELECT c FROM Conversation c WHERE c.user1 = ?1AND c.user2 = ?2OR c.user1 = ?2AND c.user2 = ?1")
    Optional<Conversation> findByUser1AndUser2(User user1, User user2);

    @Query("SELECT c FROM Conversation c " +
       "WHERE (c.user1 = :user1 AND c.user2 = :user2) " +
       "   OR (c.user1 = :user2 AND c.user2 = :user1)")
    Optional<Conversation> findBetweenUsers(@Param("user1") User user1,
                                         @Param("user2") User user2);
}

