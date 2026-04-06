import { useState } from 'react';
import { Link } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Box, Typography, Button, Container } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

// Dữ liệu các slide (bạn có thể thay đổi sau)
const heroSlides = [
  {
    id: 1,
    image: 'https://via.placeholder.com/1920x1080/1e3a8a/ffffff?text=Summer+Collection', // thay bằng ảnh thật sau
    title: 'Summer Collection 2026',
    subtitle: 'Khám phá những món đồ thời trang hot nhất mùa hè này',
    ctaText: 'Mua ngay',
    ctaLink: '/shop',
    bgColor: 'rgba(30, 58, 138, 0.65)', // overlay tối
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/1920x1080/7e22ce/ffffff?text=Electronics+Deals',
    title: 'Siêu Sale Electronics',
    subtitle: 'Giảm đến 50% cho laptop, tai nghe và phụ kiện công nghệ',
    ctaText: 'Xem deal',
    ctaLink: '/shop?category=electronics',
    bgColor: 'rgba(126, 34, 206, 0.65)',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/1920x1080/166534/ffffff?text=Home+&+Living',
    title: 'Trang trí nhà đẹp',
    subtitle: 'Mang không gian sống sang trọng và tiện nghi hơn',
    ctaText: 'Khám phá ngay',
    ctaLink: '/shop?category=home',
    bgColor: 'rgba(22, 101, 52, 0.65)',
  },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = heroSlides.map((slide) => (
    <Box
      key={slide.id}
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '88vh' },
        backgroundImage: `url(${slide.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Overlay tối */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: slide.bgColor,
        }}
      />

      {/* Nội dung text */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          color: 'white',
          px: { xs: 3, md: 6 }
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: '600px' } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              fontWeight: 'bold',
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            {slide.title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              mb: 4,
              opacity: 0.95,
              maxWidth: '480px',
            }}
          >
            {slide.subtitle}
          </Typography>

          <Button
  component={Link}
  to={slide.ctaLink}
  variant="contained"
  size="large"
  endIcon={<ArrowForward sx={{ fontSize: 28 }} />}
  sx={{
    bgcolor: 'white',
    color: 'black',
    fontSize: '1.25rem',           // Tăng cỡ chữ
    fontWeight: 'bold',            // Làm chữ đậm hơn
    px: 7,                         // Tăng padding ngang
    py: 2.2,                       // Tăng padding dọc (cao hơn)
    borderRadius: '9999px',        // Giữ bo tròn pill shape
    textTransform: 'none',         // Không viết hoa toàn bộ
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',   // Thêm bóng đổ đẹp
    minWidth: '220px',             // Đảm bảo nút không bị nhỏ trên mobile
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
      bgcolor: '#f8f9fa',
      transform: 'translateY(-6px)',     // Nâng cao hơn một chút
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
    },

    '&:active': {
      transform: 'translateY(-2px)',
    },

    // Responsive cho mobile
    '@media (max-width: 600px)': {
      fontSize: '1.1rem',
      px: 6,
      py: 2,
    },
  }}
>
  {slide.ctaText}
</Button>
        </Box>
      </Container>
    </Box>
  ));

  return (
    <Box sx={{ position: 'relative' }}>
      <AliceCarousel
        items={items}
        autoPlay
        autoPlayInterval={5000}
        animationDuration={800}
        infinite
        disableButtonsControls={false}
        disableDotsControls={false}
        mouseTracking
        onSlideChange={(e) => setActiveIndex(e.item)}
        responsive={{
          0: { items: 1 },
          1024: { items: 1 },
        }}
                renderPrevButton={({ isDisabled }) => (
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 20, md: 50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              display: isDisabled ? 'none' : 'block',
            }}
          >
            <Box
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.8)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                },
              }}
            >
              <ArrowBack sx={{ fontSize: { xs: 26, md: 32 }, color: '#1e3a8a' }} />
            </Box>
          </Box>
        )}

        renderNextButton={({ isDisabled }) => (
          <Box
            sx={{
              position: 'absolute',
              right: { xs: 20, md: 50 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              display: isDisabled ? 'none' : 'block',
            }}
          >
            <Box
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.8)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                },
              }}
            >
              <ArrowForward sx={{ fontSize: { xs: 26, md: 32 }, color: '#1e3a8a' }} />
            </Box>
          </Box>
        )}
      />

      {/* Indicator dots tùy chỉnh nếu muốn (Alice đã có sẵn dots) */}
    </Box>
  );
};

export default HeroSection;