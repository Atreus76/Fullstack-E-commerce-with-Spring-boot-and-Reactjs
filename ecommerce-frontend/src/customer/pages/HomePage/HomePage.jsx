import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Star, ShoppingCart } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import useCartStore from "../../../store/cartStore";
import { useSearchParams } from "react-router-dom";
import api from '../../../api/client';

const HomePage = () => {
  const addToCart = useCartStore((state) => state.addToCart);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category"); // e.g. ?category=3

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const params = categoryId ? { params: { category: categoryId } } : {};
      const res = await api.get("/products", params);
      return res.data; // array of products
    },
  });

  return (
    <Box>
      {/* ==================== HERO SECTION ==================== */}
      <Box
        sx={{
          height: "90vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/assets/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Summer Collection 2026
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: 600 }}>
            Discover trending fashion, electronics & more with unbeatable prices
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
            onClick={() => (window.location.href = "/shop")}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* ==================== CATEGORIES ==================== */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {["Fashion", "Electronics", "Home&Living", "Beauty", "Sports"].map(
            (cat, i) => (
              <Grid item size={{ xs: 12, sm: 6, md: 2.4 }} key={i}>
                <Card
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: "100%", height: 180, objectFit: "cover" }}
                    image={`/assets/${cat.toLowerCase()}.jpg`}
                    alt={cat}
                  />
                  <CardContent>
                    <Typography variant="h6">{cat}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      </Container>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Featured Products
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {isLoading ? (
              <Typography>Loading products...</Typography>
            ) : error ? (
              <Typography color="error">Failed to load products {error.message}</Typography>
            ) : (
              products.slice(0, 8).map((product) => (
                <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: 180, objectFit: "cover" }}
                      image={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" noWrap>
                        {product.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star sx={{ color: "#ffc107" }} />
                        <Typography>{product.rating || 4.5}</Typography>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ${product.price}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Thêm các section khác: Best Sellers, Testimonials, Newsletter... */}
    </Box>
  );
};

export default HomePage;
