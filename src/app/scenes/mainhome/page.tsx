import React from 'react'
import { SelectedPage } from '@/app/shared/types'

type Props = {
    setSelectedPage: (value: SelectedPage) => void
}

const MainHome = ({setSelectedPage}: Props) => {
  return (
    <div>MainHome</div>
  )
}

export default MainHome;