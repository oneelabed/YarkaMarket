package yarkaMarket.market.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import yarkaMarket.market.entity.Listing;

import java.util.Optional;

@Repository
@SuppressWarnings("null")
public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Query("SELECT l FROM Listing l WHERE l.creator = ?1")
    Optional<Listing> findByUserId(Long id);

    @Query("SELECT l FROM Listing l WHERE l.id = ?1")
    Optional<Listing> findById(Long id);
}
