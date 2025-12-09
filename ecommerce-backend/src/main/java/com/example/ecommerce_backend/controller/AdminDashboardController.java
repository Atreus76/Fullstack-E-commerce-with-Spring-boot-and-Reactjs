package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.AdminDashboardResponse;
import com.example.ecommerce_backend.DTO.TopProduct;
import com.example.ecommerce_backend.DTO.OrderSummary;
import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
import com.example.ecommerce_backend.status.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @GetMapping
    public AdminDashboardResponse getDashboard() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> paidOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PAID)
                .toList();

        BigDecimal totalRevenue = paidOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate today = LocalDate.now();
        BigDecimal todaySales = paidOrders.stream()
                .filter(o -> o.getCreatedAt().toLocalDate().equals(today))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Top 5 products by quantity sold
        Map<Product, Integer> salesByProduct = new HashMap<>();
        paidOrders.forEach(order ->
                order.getItems().forEach(item -> {
                    Product p = productRepository.findById(item.getProductId()).orElse(null);
                    if (p != null) {
                        salesByProduct.merge(p, item.getQuantity(), Integer::sum);
                    }
                })
        );

        List<TopProduct> topProducts = salesByProduct.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(e -> new TopProduct(
                        e.getKey().getId(),
                        e.getKey().getName(),
                        e.getKey().getImages().get(0),
                        e.getValue()
                ))
                .toList();

        // Recent 10 orders
        List<OrderSummary> recentOrders = allOrders.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(o -> new OrderSummary(
                        o.getId(),
                        o.getUser().getEmail(),
                        o.getTotalAmount(),
                        o.getStatus().name(),
                        o.getCreatedAt()
                ))
                .toList();

        return new AdminDashboardResponse(
                totalRevenue,
                allOrders.size(),
                paidOrders.size(),
                allOrders.size() - paidOrders.size(),
                todaySales,
                topProducts,
                recentOrders
        );
    }
}
