package yarkaMarket.market.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @Enumerated(EnumType.STRING)
    private Category category;
    private boolean isApproved = true;

    public Listing(String title, String description, Category category) {
        this.title = title;
        this.description = description;
        this.category = category;
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

    public Category getCategory() {
        return category;
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

    public void setCategory(Category category) {
        this.category = category;
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
        ELECTRONICS, FASHION, HOME, VEHICLES, SERVICES, OTHER
    }
}
