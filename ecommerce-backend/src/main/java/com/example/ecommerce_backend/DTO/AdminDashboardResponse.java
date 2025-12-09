package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AdminDashboardResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long paidOrders;
    private long pendingOrders;
    private BigDecimal todaySales;
    private List<TopProduct> topProducts;
    private List<OrderSummary> recentOrders;
}
