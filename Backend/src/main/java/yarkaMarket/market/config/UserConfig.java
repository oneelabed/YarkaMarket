package yarkaMarket.market.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.UserRepository;

@Configuration
public class UserConfig {

    @Bean
    CommandLineRunner commandLineRunner(UserRepository repository) {
        return args -> {
            User admin = new User("Oneel", "Abed", "0523063677", "oneelabed123@gmail.com", "1596321");
            admin.setAdminRole();
            admin.setApproved();

            repository.save(admin);
        };  // Closing the lambda
    }
}
