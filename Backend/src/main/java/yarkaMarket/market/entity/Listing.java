package yarkaMarket.market.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "listings")
public class Listing {
    @Id
    @SequenceGenerator(
            name = "listing_sequence",
            sequenceName = "listing_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "listing_sequence"
    )
    private Long id;
    private String title, description;
    private Double price;
    private String image;
    @Enumerated(EnumType.STRING)
    private Category category;
    @ManyToOne
    @JoinColumn(name = "creator")
    private User creator;
    private String username; 
    private boolean isApproved = true;

    public Listing() {

    }

    public Listing(String title, String description, Double price, Category category, String image, User creator) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
        this.creator = creator;
        this.username = creator.getUsername();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Category getCategory() {
        return category;
    }

    public String getImage() {
        return image;
    }

    public User getCreator() {
        return creator;
    }

    public String getUsername() {
        return username;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public void setUsername() {
        this.username = creator.getUsername();
    }

    public void setApproved() {
        this.isApproved = true;
    }   

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                "title" + title +
                "description" + description +
                "category" + category +
                '}';
    }

    public enum Category {
        Electronics, Clothing, Sports, Books, Home, Other
    }
}