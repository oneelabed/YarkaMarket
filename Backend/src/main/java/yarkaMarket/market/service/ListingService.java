package yarkaMarket.market.service;

import org.springframework.stereotype.Service;

import yarkaMarket.market.entity.Listing;
import yarkaMarket.market.entity.Listing.Category;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ListingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // Get all listings
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    // Get one listing by id (optional)
    public Optional<Listing> getListingById(Long id) {
        return listingRepository.findById(id);
    }

    // Save a new listing
    public void saveListing(Listing listing) {
        listingRepository.save(listing);
    }

    // Update an existing listing
    public void updateListing(Listing listing,
        String title,
        String description,
        Double price,
        Category category, 
        String image,
        String publicId, 
        User user) {

        listing.setTitle(title);
        listing.setDescription(description);

        if (price != null)
            listing.setPrice(price);

        listing.setCategory(category);
        listing.setImage(image);
        listing.setImagePublicId(publicId);
        listing.setCreator(user);
        listing.setUsername();
        listingRepository.save(listing);
    }

    // Delete a listing by id
    public void deleteListing(Long id) {
        listingRepository.deleteById(id);
    }
}
