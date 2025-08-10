package yarkaMarket.market.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import yarkaMarket.market.entity.Listing;

import java.util.Optional;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    // SELECT * FROM listings WHERE id = ?
    @Query("SELECT l FROM Listing l WHERE l.image = ?1")
    Optional<Listing> findListingById(String image);
}
