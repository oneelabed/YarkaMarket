package yarkaMarket.market.entity.User;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import yarkaMarket.market.repository.UserRepository;

@Configuration
public class UserConfig {

    @Bean
    CommandLineRunner commandLineRunner(UserRepository repository) {
        return args -> {  // Added 'return' here
            repository.save(new User("oneelabed123@gmail.com", "1596321"));
        };  // Closing the lambda
    }
}
