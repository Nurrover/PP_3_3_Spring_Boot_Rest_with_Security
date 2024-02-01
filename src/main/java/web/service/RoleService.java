package web.service;


import web.model.Role;

import java.util.List;

public interface RoleService {
    void addRole (Role role);
    Role findByNameRole (String name);
    List<Role> getAllRoles();
    Role findByIdRole(Long id);
    List<Role> listByRole(List<String> name);
}
