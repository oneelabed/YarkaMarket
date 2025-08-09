package yarkaMarket.market.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.entity.Listing;
import yarkaMarket.market.repository.ListingRepository;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequiredArgsConstructor
@RequestMapping("/listings")
public class ListingController {

    @Autowired
    private ListingRepository repository;

    @GetMapping
    public List<Listing> getAllListings() {
        return repository.findAll();
    }

    @PostMapping
    public Listing createListing(@RequestBody Listing listing) {
        return repository.save(listing);
    }
}