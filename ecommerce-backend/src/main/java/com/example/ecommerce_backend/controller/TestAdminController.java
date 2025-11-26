package com.example.ecommerce_backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestAdminController {
    @GetMapping("/anyone")
    public String anyone() {
        return "This works for everyone (even without token)";
    }

    @GetMapping("/authenticated")
    public String authenticated() {
        return "You are logged in!";
    }

    @GetMapping("/admin-has-role")
    @PreAuthorize("hasRole('ADMIN')")           // ← classic version
    public String adminHasRole() {
        return "SUCCESS with hasRole('ADMIN')";
    }

    @GetMapping("/admin-has-authority")
    @PreAuthorize("hasAuthority('ADMIN')")      // ← matches our JWT exactly
    public String adminHasAuthority() {
        return "SUCCESS with hasAuthority('ADMIN')";
    }

    @GetMapping("/admin-has-authority-role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // ← if we ever switch to ROLE_ prefix
    public String adminHasAuthorityRole() {
        return "SUCCESS with hasAuthority('ROLE_ADMIN')";
    }
}
