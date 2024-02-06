package web.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.Role;
import web.model.User;
import web.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private PasswordEncoder encoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleService roleService, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void addUser(User user) {
        List<String> convert = user.getRoles().stream().map(Role::getRole).collect(Collectors.toList());
        List<Role> newRoles = roleService.listByRole(convert);
        user.setRoles(Set.copyOf(newRoles));
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void editUser(User user) {
        User oldUser = userRepository.findById(user.getId()).get();
        if(!user.getPassword().equals(oldUser.getPassword())) {
            user.setPassword(encoder.encode(user.getPassword()));
        }

        if (user.getRoles().isEmpty()) {
            user.setRoles(oldUser.getRoles());
        } else {
            List<String> convert = user.getRoles().stream().map(Role::getRole).collect(Collectors.toList());
            List<Role> newRoles = roleService.listByRole(convert);
            user.setRoles(Set.copyOf(newRoles));
        }

        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOne = getUserByEmail(email);
        if (userOne.isEmpty()) {
            throw new UsernameNotFoundException(email + " не найден");
        }

        return userOne.get();
    }
}
