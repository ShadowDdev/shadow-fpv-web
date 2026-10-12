import React, {useState} from 'react';
import {Sun, Moon} from 'lucide-react';
export default function ThemeToggle(){
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'dark');
  function toggle(){
    const next=theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    document.documentElement.style.colorScheme=next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#17161c':'#f4f3ef');
    try{localStorage.setItem('shadow-fpv-theme',next);}catch{/* Keep the current choice for this page when storage is unavailable. */}
    setTheme(next);
  }
  return <button className="theme-toggle" onClick={toggle} aria-label={'Switch to '+(theme==='dark'?'light':'dark')+' theme'} title={'Switch to '+(theme==='dark'?'light':'dark')+' theme'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}<span>{theme==='dark'?'Light':'Dark'}</span></button>;
}
