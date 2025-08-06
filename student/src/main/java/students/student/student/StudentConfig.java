package students.student.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StudentConfig {

    @Bean
    CommandLineRunner commandLineRunner(StudentRepository repository) {
        return args -> {  // Added 'return' here
            repository.save(new Student("oneel", "1596321"));
        };  // Closing the lambda
    }
}
