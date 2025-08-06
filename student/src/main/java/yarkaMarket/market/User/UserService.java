package yarkaMarket.market.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public void addNewUser(User user) {
        Optional<User> userByEmail = userRepository.findUserByEmail(user.getEmail());

        if (userByEmail.isPresent())
            throw new IllegalStateException("email taken");
        userRepository.save(user);
    }

    public void deleteUser(long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalStateException("user with id " + id + "does not exist");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public void updateUser(long userId, String email, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException(
                        "user with id " + userId + " does not exist"));
        if (password != null && password.length() > 0 && !Objects.equals(user.getPassword(), password)) {
            user.setPassword(password);
        }

        if (email != null && email.length() > 0 && !Objects.equals(user.getEmail(), email)) {
            Optional<User> userByEmail = userRepository.findUserByEmail(user.getEmail());

            if (userByEmail.isPresent())
                throw new IllegalStateException("email taken");
            user.setEmail(email);
        }
    }
}
