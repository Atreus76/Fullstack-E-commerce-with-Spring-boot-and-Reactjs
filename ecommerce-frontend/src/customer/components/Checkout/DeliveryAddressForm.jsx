import React from 'react'
import { Button, Grid, Box, TextField } from '@mui/material'
import AddressCard from '../AddressCard/AddressCard'

const DeliveryAddressForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const address = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            address: data.get('address'),
            city: data.get('city'),
            state: data.get('state'),
            zip: data.get('zip'),
            phoneNumber: data.get('phoneNumber'),
        }
        console.log("address", data)
    }
  return (
    <div>
        <Grid container spacing={4}>
            <Grid size={{xs:12, lg: 5}} className="border rounded-e-md shadow-md h-[30rem] overflow y-scroll">
                <div className='p-5 py-7 border-b cursor-pointer'>
                    <AddressCard />
                    <Button sx={{mt:2, bgcolor:"RGB(145 85 253)"}}
                        size='large'
                        variant='contained'
                    >
                        Delivery Here
                    </Button>
                </div>
            </Grid>
            <Grid item size={{xs:12, lg:7}}>
                <Box className="border rounded-s-md shadow-md p-5">
                    <form onSubmit={handleSubmit} action="
                    ">
                        <Grid container spacing={3}>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='firstName'
                                name='firstName'
                                label='First Name'
                                fullWidth
                                autoComplete='given-name'
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='lastName'
                                name='lastName'
                                label='Last Name'
                                fullWidth
                                autoComplete='given-name'
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12}}>
                                <TextField
                                required
                                id='address'
                                name='address'
                                label='Address'
                                fullWidth
                                autoComplete='given-name'
                                multiline
                                rows={4}
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='city'
                                name='city'
                                label='City'
                                fullWidth
                                autoComplete='given-name'
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='state'
                                name='state'
                                label='State/Province/Region'
                                fullWidth
                                autoComplete='given-name'
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='zip'
                                name='zip'
                                label='Zip/Postal Code'
                                fullWidth
                                autoComplete='shipping postal-code'
                                >

                                </TextField>
                            </Grid>
                            <Grid item size={{xs:12, sm: 6}}>
                                <TextField
                                required
                                id='phoneNumber'
                                name='phoneNumber'
                                label='Phone Number'
                                fullWidth
                                autoComplete='given-name'
                                >

                                </TextField>
                            </Grid>
                             <Grid py={1.5} item size={{xs:12, sm: 6}}>
                                <Button sx={{mt:2, bgcolor:"RGB(145 85 253)"}}
                        size='large'
                        variant='contained'
                        type='submit'
                    >
                        Delivery Here
                    </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Grid>
        </Grid>
    </div>
  )
}

export default DeliveryAddressForm