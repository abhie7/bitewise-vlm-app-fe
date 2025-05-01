import { useSelector } from 'react-redux'

export const useAccessToken = () => {
  const user = useSelector((state: any) => state.auth)
  const token = user?.user?.token || user?.user?.data?.token || null
  return token
}
