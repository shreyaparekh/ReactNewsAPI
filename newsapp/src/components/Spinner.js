import React from 'react'
import loading from './spinner.gif'
// export default class Spinner extends Component {
  const Spinner=()=>{
    return (
      <div className='text-center'>
        <img src={loading} alt="loading" className='my-3' />
      </div>
    )
 
}
export default Spinner