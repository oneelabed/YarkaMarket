package yarkaMarket.market.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private Long id;
    private String firstName, lastName, email, password, username;
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    private boolean isApproved = true;

    public User() {
        
    }

    public User(String firstName, String lastName, String email,
                   String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.username = firstName + " " + lastName;
    }

    public void setAdminRole() {
        this.role = Role.ADMIN;
    }

    public void setApproved() {
        this.isApproved = true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                "firstName" + firstName +
                "lastName" + lastName +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public enum Role {
        USER,
        ADMIN
    }
}


