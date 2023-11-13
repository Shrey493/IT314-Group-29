//importing css
import '../App.css';

//importing MUI cmp
import { Typography } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material/'

//importing react cmp
//import { useState } from 'react';

//importing custom cmp
import theme from "../general_compo/theme.js";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function PastOrder(props) {

    const displayOrders = props.items.map((item) => (
        <div key={item.canteen} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Item><Typography>{item.name}</Typography></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item><Typography>{item.quantity}</Typography></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item><Typography>{item.price}</Typography></Item>
                </Grid>
            </Grid>
        </div>
    ))

    return (
        //displaying order
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '40px', backgroundColor: '#E9DCDC', borderRadius: '30px', margin: '20px', width: '1100px' }}>
                <div>
                    <Typography variant='h3' sx={{ marginBottom: '20px' }}>Order Details</Typography>
                    {displayOrders}
                </div>
                <div>
                    <div>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Feedback"
                        multiline
                        maxRows={5}
                        variant="filled"
                    />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant='contained' onClick={()=>(props.onButtonClick())} sx={{ marginTop: '50px', marginLeft: '20px' }}>Submit</Button>
                    </div>

                </div>
            </div>
        </ThemeProvider>
    )
}

export default PastOrder;