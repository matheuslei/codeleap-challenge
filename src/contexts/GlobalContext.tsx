import { Dispatch, SetStateAction, createContext } from 'react'
import { TPost } from 'types/post'
import useGlobalProvider from '../hooks/useGlobalProvider'

interface IGlobalContextData {
  username: string | undefined
  setUsername: (user: string | undefined) => void
  removeUsername: () => void
  openEditModal: boolean
  openDeleteModal: boolean
  toggleEditModal: () => void
  toggleDeleteModal: () => void
  posts: TPost[] | []
  setPosts: Dispatch<SetStateAction<TPost[]>>
  currentPost: TPost
  setCurrentPost: Dispatch<SetStateAction<TPost>>
  handleGetPosts: () => void
}

const GlobalContext = createContext<IGlobalContextData>({} as IGlobalContextData)

type Props = {
  children: JSX.Element
}

export const GlobalProvider = (props: Props) => {
  const globalProvider = useGlobalProvider()
  return (
    <GlobalContext.Provider value={globalProvider}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
