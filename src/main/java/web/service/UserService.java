package web.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

    void addUser(User user);
    List<User> getAllUsers();
    void deleteUserById(Long id);
    void editUser(User user);
    User getUserById(Long id);
    Optional<User> getUserByEmail(String email);
}
