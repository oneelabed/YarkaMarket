package yarkaMarket.market.service;

import org.springframework.stereotype.Service;

import yarkaMarket.market.entity.Listing;
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
    public Listing saveListing(Listing listing) {
        return listingRepository.save(listing);
    }

    // Update an existing listing
    public Listing updateListing(Listing listing) {
        return listingRepository.save(listing);
    }

    // Delete a listing by id
    public void deleteListing(Long id) {
        listingRepository.deleteById(id);
    }
}
