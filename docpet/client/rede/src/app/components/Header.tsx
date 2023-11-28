"use client"
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import {FaSearch, FaBell} from 'react-icons/fa'
import {TbMessageCircle2Filled} from 'react-icons/tb'
import { makeRequest } from "../../../axios";
import { UserContext } from "@/context/UserContext";
import { IUser } from "@/interfaces";


function Header() {

    const {user, setUser} = useContext(UserContext)
    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch ] = useState<string|null>(null)
    const [searchResults, setSearchResults] = useState(false)
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () =>{
            return await makeRequest.post('auth/logout').then((res)=>{
                res.data;
            });
        },
        onSuccess: ()=>{
            setUser(undefined)
            localStorage.removeItem('rede: user');
            router.push('/login')
        }
    })


    const {data, error} = useQuery({
        queryKey: ['search'],
        queryFn: ()=> makeRequest.get(`search/search-users?params=${search}`).then((res)=>{
            return res.data
        }),
        enabled: !!search //so vai fazer a req quando houver um user
    })

    if(error){
        console.log(error)
    }

    console.log(data)

    return(
<header className="fixed z-10 w-full bg-white flex justify-between py-2 px-4 items-center shadow-md">
  {/* Logo and site name */}
  <Link href="/main" className="font-bold text-sky-900 text-lg flex items-center gap-2">
    <img
      src="https://github.com/joyzinhw/projeto-integrador/blob/main/assets/img/www.png?raw=true"
      alt="Logo Codpet"
      className="w-8 h-8 rounded-full"
    />
    codpet
  </Link>

  {/* Search bar */}
  <div className="flex bg-zinc-100 items-center text-gray-600 px-3 py-1 rounded-full relative" onClick={() => setSearchResults(true)} onMouseLeave={() => setSearchResults(false)}>
    <input
      type="text"
      placeholder="Pesquisar"
      className="bg-zinc-100 focus:outline-none focus:ring focus:border-sky-500 px-4 py-2 rounded-full"
      onChange={(e) => setSearch(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          router.push('/search?params=' + search);
        }
      }}
      value={search ? search : ''}
    />

    <Link href={'/search?params=' + search}>
      <FaSearch onClick={() => { setSearch(null), setSearchResults(false) }} className="cursor-pointer" />
    </Link>

    {search && searchResults && (
      <div className="absolute flex flex-col bg-white p-4 shadow-md rounded-md gap-2 border-t-3 whitespace-nowrap right-0 left-0 top-full">
        {data?.map((users: IUser, id: number) => (
          <Link
            href={'/profile?id=' + users.id}
            key={id}
            className="flex items-center gap-2"
            onClick={() => {
              setSearch(null);
              setSearchResults(false);
            }}
          >
            <img
              src={users && users.userImg ? users.userImg : 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'}
              alt="imagem do perfil"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold">{users?.username}</span>
          </Link>
        ))}
        <Link
          href={'/search?params=' + search}
          className="font-semibold border-t border-zinc-300 text-center pt-2"
          onClick={() => {
            setSearch(null);
            setSearchResults(false);
          }}
        >
          Ver todos os resultados
        </Link>
      </div>
    )}
  </div>

  {/* User profile section */}
  <div className="flex gap-2 items-center text-gray-600">
    <div className="flex gap-3">
    </div>
    <div className="relative" onMouseLeave={() => setShowMenu(false)} onMouseEnter={() => setShowMenu(true)}>
      <button className="flex gap-2 items-center focus:outline-none" onClick={() => setShowMenu(!showMenu)}>
        <Link href={'/profile?id=' + user?.id}>
          <img
            src={user?.userImg ? user.userImg : 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'}
            alt="imagem do perfil"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
          <span className="font-bold">{user?.username}</span>
        </Link>
      </button>
      {showMenu && (
        <div className="absolute flex flex-col bg-white p-4 shadow-md rounded-md gap-2 border-t-3 whitespace-nowrap right-[-10px]">
          {/* Add menu links as needed */}
          <button onClick={() => mutation.mutate()} className="cursor-pointer">Sair</button>
        </div>
      )}
    </div>
  </div>
</header>


    )
}

export default Header;