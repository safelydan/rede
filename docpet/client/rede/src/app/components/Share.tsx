"use client"

import UserContext from "@/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import {FaPaperPlane, FaUserFriends } from "react-icons/fa";
import { TbPhoto } from "react-icons/tb";
import { makeRequest } from "../../../axios";
import Link from "next/link";

function Share() {

    const {user} = useContext(UserContext)
    const [post_desc, setDesc] = useState('')
    const [postImg, setPostImg] = useState('')
    const [img, setImg] = useState<File | null>(null)

    const queryCliente = useQueryClient()

    useEffect(()=>{
        if(img){
            setPostImg(URL.createObjectURL(img))
        }}, [img]);

    const mutation = useMutation({
        mutationFn: async(newPost:{}) =>{
            await makeRequest.post('post/', newPost).then((res)=>{
                return res.data
            })
        },
        onSuccess:()=>{
            queryCliente.invalidateQueries({queryKey: ['posts']})
        },
    })

    const upload = async ()=>{
        try {
            const formData = new FormData
            img && formData.append('file', img)
            const res= await makeRequest.post('upload/', formData)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const sharePost = async () =>{
        let imgUrl = ''
        if(img){
            imgUrl = await upload()
        }
        mutation.mutate({post_desc, img: imgUrl, userId: user?.id})
        setDesc('')
        setImg(null)
    }


    return(

<div className="w-full bg-white rounded-lg p-4 shadow-md">
  {img && <img src={postImg} alt="img do post" className="w-full rounded-lg mb-2" />}
  <div className="flex items-start gap-4">

    <Link href={'/profile?id=' + user?.id}>
      <img
        src={user?.userImg ? user.userImg : 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'}
        alt="imagem do perfil"
        className="u-8 h-8 rounded-full"
      />
    </Link>

    <div className="flex flex-col w-full">
      <textarea
        placeholder={`O que está acontecendo, ${user?.username}?`}
        value={post_desc}
        className="w-full bg-zinc-100 focus:outline-none rounded-lg resize-none"
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          <input
            type="file"
            id="img"
            className="hidden"
            onChange={(e) => e.target.files && setImg(e.target.files[0])}
          />
          <label htmlFor="img" className="cursor-pointer">
            <TbPhoto className='text-2xl text-gray-500 hover:text-blue-500' />
          </label>
        </div>
        <button
          onClick={() => sharePost()}
          className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
        >
          Postar
        </button>
      </div>
    </div>
  </div>
</div>


)
}

export default Share;