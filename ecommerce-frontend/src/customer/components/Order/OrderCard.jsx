import React from 'react'
import AdjustIcon from '@mui/icons-material/Adjust';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
const OrderCard = () => {
    const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/account/order/${5}`)} className='p-5 shadow-md shadow-black hover:shadow-2xl border'>
        <Grid container spacing={2} sx={{justifyContnt:"space-between"}}>
            <Grid item size={{xs:6}}>
                <div className='flex cursor-pointer'>
                    <img className='w-[5rem] h-[5rem] object-cover object-top' src="https://img.freepik.com/free-vector/
                shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
                    <div className='ml-5 space-y-2'>
                        <p className=''>Chan vai ca lon</p>
                        <p className='opacity-50 text-xs font-semibold'>Size: Dit con me may</p>
                        <p className='opacity-50 text-xs font-semibold'>Color: Mau lon me may</p>
                    </div>
                </div>
            </Grid>
            <Grid item size={{xs:2}}>
                <p>$199</p>
            </Grid>

            <Grid item size={{xs:4}}>
                
                    {true && <div>
                     <p>
                        <AdjustIcon sx={{width:"15px", height:"15px"}} className='text-green-600 mr-2 text-sm' />
                     <span>
                        Deliverd On March 03
                    </span>
                    </p>
                    <p className='text-xs'>
                        Your item has been delivered
                    </p>
                    </div>}
                        
                    {false && <p><span>
                        Deliverd On March 03
                    </span> </p> }
                
            </Grid>
        </Grid>
    </div>
  )
}

export default OrderCard