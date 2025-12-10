import { Button, Grid, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <Grid className='bg-black text-white text-center mt-10'
        container
        sx={{bgcolor:"black", color:"white", py:3}}>
            <Grid item size={{xs: 12, sm: 6, md: 3}}>
                <Typography className='pb-5' variant='h6'> Company </Typography>
                <div>
                    <Button className='pb-5' variant='h6' > About </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Blog </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Press </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Jobs </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Partners </Button>

                </div>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, md: 3}}>
                <Typography className='pb-5' variant='h6'> Solutions </Typography>
                <div>
                    <Button className='pb-5' variant='h6' > Marketing </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Analytics </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Commerce </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Insights </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Support </Button>

                </div>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, md: 3}}>
                <Typography className='pb-5' variant='h6'> Documentation </Typography>
                <div>
                    <Button className='pb-5' variant='h6' > Guides </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > API Status </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Press </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Jobs </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Partners </Button>

                </div>
            </Grid>
            <Grid item size={{xs: 12, sm: 6, md: 3}}>
                <Typography className='pb-5' variant='h6'> Legal </Typography>
                <div>
                    <Button className='pb-5' variant='h6' > Claim </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Privacy </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Terms </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Jobs </Button>

                </div>
                <div>
                    <Button className='pb-5' variant='h6' > Partners </Button>

                </div>
            </Grid>
            <Grid className='pt-20' item size={{xs: 12}}>
                <Typography className='pt-5' variant='body2'>&copy; 2024 Your Company. All rights reserved.</Typography>

            </Grid>
        </Grid>
        
    </div>
  )
}

export default Footer