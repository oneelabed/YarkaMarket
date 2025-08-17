package yarkaMarket.market.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.conversation = ?1 ORDER BY m.timestamp ASC")
    List<Message> findByConversation(Conversation conversation);

    @Query("SELECT COUNT(*) FROM Message m WHERE m.timestamp > ?1")
    long countByCreatedAtAfter(LocalDateTime time);

}
