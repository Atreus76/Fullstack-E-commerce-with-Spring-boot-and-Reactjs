import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Box, Container, Typography, Avatar, Rating } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

// Dữ liệu testimonial (bạn có thể thay bằng dữ liệu thật sau, thậm chí fetch từ API)
const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    role: "Khách hàng tại TP.HCM",
    avatar: "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=NTL", // thay bằng ảnh thật sau
    rating: 5,
    text: "Sản phẩm chất lượng tuyệt vời, giao hàng nhanh chóng chỉ trong 2 ngày. Tôi rất hài lòng với dịch vụ chăm sóc khách hàng!",
  },
  {
    id: 2,
    name: "Trần Minh Quân",
    role: "Freelancer",
    avatar: "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=TMQ",
    rating: 5,
    text: "Mua laptop giảm giá cực tốt. Giao diện website dễ dùng, thanh toán Stripe an toàn. Đã giới thiệu cho nhiều bạn bè.",
  },
  {
    id: 3,
    name: "Lê Thị Hồng",
    role: "Mẹ bỉm sữa",
    avatar: "https://via.placeholder.com/150/45B7D1/FFFFFF?text=LTH",
    rating: 4,
    text: "Đồ dùng cho bé rất đẹp và an toàn. Giá cả hợp lý, mình mua nhiều lần rồi. Giao hàng cẩn thận, không bị hỏng.",
  },
  {
    id: 4,
    name: "Phạm Hoàng Nam",
    role: "Sinh viên",
    avatar: "https://via.placeholder.com/150/96CEB4/FFFFFF?text=PHN",
    rating: 5,
    text: "Tai nghe âm thanh rất tốt, pin trâu. Mua lần đầu hơi lo nhưng sau khi nhận hàng thì hoàn toàn hài lòng. Cảm ơn shop!",
  },
];

const TestimonialsSection = () => {
  const items = testimonials.map((testimonial) => (
    <Box
      key={testimonial.id}
      sx={{
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: 2,
        p: { xs: 4, md: 6 },
        mx: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        border: '1px solid #f0f0f0',
      }}
    >
      <FormatQuote sx={{ fontSize: 60, color: 'primary.main', opacity: 0.2, mb: 2 }} />

      <Typography
        variant="body1"
        sx={{
          fontSize: '1.1rem',
          fontStyle: 'italic',
          mb: 4,
          minHeight: 120,
          lineHeight: 1.6,
        }}
      >
        "{testimonial.text}"
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto' }}>
        <Avatar
          src={testimonial.avatar}
          alt={testimonial.name}
          sx={{ width: 80, height: 80, mb: 2, border: '3px solid #f0f0f0' }}
        />
        
        <Rating value={testimonial.rating} readOnly size="medium" sx={{ mb: 1 }} />
        
        <Typography variant="h6" fontWeight="bold">
          {testimonial.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {testimonial.role}
        </Typography>
      </Box>
    </Box>
  ));

  return (
    <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Khách hàng nói gì về chúng tôi
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Hơn 5000+ khách hàng đã tin tưởng và mua sắm tại ShopVibe
          </Typography>
        </Box>

        <AliceCarousel
          items={items}
          autoPlay
          autoPlayInterval={6000}
          animationDuration={800}
          infinite
          disableButtonsControls={false}
          disableDotsControls={true}
          mouseTracking
          responsive={{
            0: { items: 1 },
            768: { items: 1 },
            1024: { items: 2 },
            1400: { items: 3 },
          }}
          paddingLeft={20}
          paddingRight={20}
        />
      </Container>
    </Box>
  );
};

export default TestimonialsSection;