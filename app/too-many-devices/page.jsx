// 

import React, { Suspense } from 'react'
import TooManyDevicesPage from '../component/TooManyDevicesContent'

function page() {
  return (
    <Suspense>
      <TooManyDevicesPage />
    </Suspense>
  )
}

export default page
