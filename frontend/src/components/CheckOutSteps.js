import React from 'react'

const CheckOutSteps = (props) => {
  return (
    <div className='grid grid-cols-4 gap-1 w-full'>
        <div className={props.step1 ? 'border-b-4 border-slate-500 text-slate-800 text-center font-semibold' : 'border-b-4 border-slate-300 text-slate-300 text-center font-semibold' }>Sign In</div>
        <div className={props.step2 ? 'border-b-4 border-slate-500 text-slate-800 text-center font-semibold' : 'border-b-4 border-slate-300 text-slate-300 text-center font-semibold'}>Shipping</div>
        <div className={props.step3 ? 'border-b-4 border-slate-500 text-slate-800 text-center font-semibold' : 'border-b-4 border-slate-300 text-slate-300 text-center font-semibold'}>Payment</div>
        <div className={props.step4 ? 'border-b-4 border-slate-500 text-slate-800 text-center font-semibold' : 'border-b-4 border-slate-300 text-slate-300 text-center font-semibold'}>Place Order</div>
    </div>
  )
}

export default CheckOutSteps