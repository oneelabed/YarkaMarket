package yarkaMarket.market.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.conversation = ?1 ORDER BY m.timestamp ASC")
    List<Message> findByConversation(Conversation conversation);

    @Query("SELECT COUNT(*) FROM Message m WHERE m.timestamp > ?1")
    long countByCreatedAtAfter(ZonedDateTime time);

    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.conversation IN (SELECT c FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId) " +
           "AND m.sender.id <> :userId " +
           "AND m.isRead = false")
    long countUnreadMessages(Long userId);
}
