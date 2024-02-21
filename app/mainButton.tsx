'use client'

import Image from 'next/image';
import { EventHandler } from 'react';

export default function MainButton(props: any) {
    var imageSrc = props.name + ".svg"
    var imageAlt = props.name + " Logo"
    var clickHandler:any = () => {
        document.location.href = props.link
    }
    
    return(
        <div 
            onClick={clickHandler} 
            className="flex justify-between flex-col items-center min-w-40 min-h-40 h-10 m-5 rounded-md bg-lime-800 p-7 group"
        >
            <Image 
                className="transition ease-in group-hover:invert group-hover:scale-110" 
                src={imageSrc} 
                width="50" 
                height="50" 
                alt={imageAlt} 
            />
          <p>{props.name}</p>
        </div>
    )
} 