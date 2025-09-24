package yarkaMarket.market.entity;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Message {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "conversation")
    private Conversation conversation;
    @ManyToOne
    @JoinColumn(name = "sender")
    private User sender;
    private String content;
    private ZonedDateTime timestamp;

    public Message() {

    }

    public Message(Conversation conversation, User sender, String content) {
        this.conversation = conversation;
        this.sender = sender;
        this.content = content;
        this.timestamp = ZonedDateTime.now(ZoneId.of("Asia/Jerusalem"));
    }
}
