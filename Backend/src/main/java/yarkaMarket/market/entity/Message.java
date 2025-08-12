package yarkaMarket.market.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
    private Conversation conversation;
    @ManyToOne
    private User sender;
    private String content;
    private LocalDateTime timestamp;
    // private boolean read;

    public Message() {

    }

    public Message(Conversation conversation, User sender, String content) {
        this.conversation = conversation;
        this.sender = sender;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
}
