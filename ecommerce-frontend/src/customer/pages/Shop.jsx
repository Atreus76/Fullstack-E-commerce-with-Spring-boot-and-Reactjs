import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import api from '../../api/client';
import ProductCard from '../components/Product/ProductCard';   // bạn đã có component này chưa? nếu chưa mình sẽ đưa code

const Shop = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('search') || ''; 

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', keyword],
    queryFn: () => 
      api.get('/api/products/search', {
        params: { 
          keyword: keyword,
          page: 0,
          size: 12 
        }
      }).then(res => res.data),
    enabled: true, // luôn fetch
  });

  if (isLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data?.content?.length) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">
          {keyword 
            ? `Không tìm thấy sản phẩm nào với từ khóa "${keyword}"` 
            : 'Không có sản phẩm nào'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : 'Tất cả sản phẩm'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {data.totalElements} sản phẩm được tìm thấy
      </Typography>

      <Grid container spacing={3}>
        {data.content.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Phân trang sẽ làm sau */}
    </Container>
  );
};

export default Shop;