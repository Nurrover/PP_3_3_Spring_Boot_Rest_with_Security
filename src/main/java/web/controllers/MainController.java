package web.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/admin")
    public String adminPage() {
        return "main-page";
    }

    @GetMapping("/user")
    public String userPage() {
        return "main-page";
    }
}
