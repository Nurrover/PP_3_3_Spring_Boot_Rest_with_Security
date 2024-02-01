package web.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

    void add (User user);
    List<User> getAllUsers();
    void delete (Long id);
    void edit(User user);
    User getUser(Long id);
    Optional<User> findByEmail (String email);
}
