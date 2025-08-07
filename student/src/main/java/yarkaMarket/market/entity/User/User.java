package yarkaMarket.market.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import lombok.val;

@Entity
@Table(name = "users")
@RequiredArgsConstructor

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
    private String firstName, lastName, phone, email, password;
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public User(String firstName, String lastName, String phone, String email,
                   String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAdminRole() {
        this.role = Role.ADMIN;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                "firstName" + firstName +
                "lastName" + lastName +
                "phone" + phone +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public enum Role {
        USER,
        ADMIN
    }
}


