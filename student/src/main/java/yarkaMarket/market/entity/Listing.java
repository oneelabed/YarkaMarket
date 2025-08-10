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
    private double price;
    private String image;
    @Enumerated(EnumType.STRING)
    private Category category;
    private String createdBy;
    private boolean isApproved = true;

    public Listing() {

    }

    public Listing(String title, String description, double price, Category category, String image, String createdBy) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
        this.createdBy = createdBy;
    }

    /*public Listing(String title, String description, double price, Category category, String image) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
        this.createdBy = null;
    }*/

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public Category getCategory() {
        return category;
    }

    public String getImage() {
        return image;
    }

    public String getUserCreatedBy() {
        return createdBy;
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

    public void setPrice(double price) {
        this.price = price;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setUserCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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