import { FC } from 'react'

interface LoadingPageProps {
  text: string
}

export const LoadingPage: FC<LoadingPageProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-4 text-lg font-medium text-primary">{text}</p>
    </div>
  )
}
