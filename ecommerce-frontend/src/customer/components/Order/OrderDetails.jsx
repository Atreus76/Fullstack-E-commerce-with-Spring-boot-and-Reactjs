import React from 'react'
import AddressCard from '../AddressCard/AddressCard'
import OrderTracker from './OrderTracker'
import { deepPurple } from '@mui/material/colors'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {Grid, Box} from '@mui/material';

const OrderDetails = () => {
  return (
    <div className='px:5 lg:px-20'>
      <div>
        <h1 className='font-bold text-xl py-7'>Delivery Address</h1>
        <AddressCard />
      </div>
      <div className='py-20'>
        <OrderTracker activeStep={3}/>
      </div>
      <Grid className="space-y-5" container>
        {[1,1,1,1,1].map((item) => <Grid item container className='shadow-xl rounded-md p-5 border w-full'
        sx={{alignItems:'center', justifyContent:'space-between'}}>
          <Grid item size={{xs:6}}>
            <div className='flex items-center space-x-4'>
              <img className='w-[5rem] h-[5rem] object-cover object-top'
              src="https://img.freepik.com/free-vector/
                shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
              <div className='space-y-2 ml-5'>
                <p className='font-semibold'>Dit con me nha may</p>
                <p className='space-x-5 opacity-50 text-xs font-semibold'><span>Color: pink</span> <span>Size: M</span></p>
                <p>Seller: Cai loz me may</p>
                <p>$6969</p>
              </div>
            </div>
          </Grid>

          <Grid item>
            <Box sx={{color:deepPurple[500]}}>
              <StarBorderIcon sx={{fontSize:"2rem"}} className='px-2'/>
              <span>Rate & Review Product</span>
            </Box>
          </Grid>
        </Grid>)}
        
      </Grid>
    </div>
  )
}

export default OrderDetails