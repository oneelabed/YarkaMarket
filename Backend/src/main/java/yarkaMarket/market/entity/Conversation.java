package yarkaMarket.market.entity;

import java.time.LocalDateTime;
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
public class Conversation {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user1")
    private User user1;
    @ManyToOne
    @JoinColumn(name = "user2")
    private User user2;
    private ZonedDateTime lastUpdated;

    public Conversation() {
        
    }

    public Conversation(User user1, User user2) {
        this.user1 = user1;
        this.user2 = user2;
    }
}



