import { Avatar, Grid, Box, Rating } from '@mui/material'
import React from 'react'

const ProductReviewCard = () => {
  return (
    <div>
        <Grid container spacing={2}>
            <Grid item size={{xs:1}}>
                <Box>
                    <Avatar className='text-white' sx={{width: 56, height:56, bgcolor:"#9155fd"}}>R</Avatar>
                </Box>
            </Grid>

            <Grid item size={{xs:9}}>
                <div className='space-y-2'>
                    <div className=''>
                        <p className='font-semibold text-lg'>AAAA</p>
                        <p className='opacity-70'>November 17, 2025</p>
                    </div>
                </div>
                <Rating value={4.5} name='half-rating' readOnly precision={.5}/>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries, but also the leap into electronic typesetting, 
                    remaining essentially unchanged.</p>

            </Grid>
        </Grid>
    </div>
  )
}

export default ProductReviewCard