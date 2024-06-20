import type React from 'react'
import type { PropsWithChildren } from 'react'

export interface BasePageProps {
  title?: string
}

export const BasePage: React.FC<PropsWithChildren<BasePageProps>> = ({
  title,
  children
}) => {
  return (
    <main
      className={
        'container mx-auto px-4 backdrop-blur-xl text-white backdrop-brightness-75'
      }
    >
      <div className={'max-w-80 mx-auto py-9'}>
        <img src={'/images/euro2024.svg'} alt='Euro 2024 Logo' />
      </div>
      {title && (
        <h1 className={'text-4xl font-semibold text-center mb-5'}>{title}</h1>
      )}
      {children}
    </main>
  )
}
